import { selectTicket, updateTicket, createTicket } from "@schemas/ticket";
import { createProtectedRouter } from "./protected-router";
import { Status } from "@prisma/client";

export const ticketRouter = createProtectedRouter()
  .query("get", {
    resolve({ ctx }) {
      return ctx.prisma.ticket.findMany({
        include: {
          user: true,
        },
      });
    },
  })
  .query("select", {
    input: selectTicket,
    resolve({ ctx, input }) {
      return ctx.prisma.ticket.findUnique({
        where: {
          id: input.id,
        },
      });
    },
  })
  .mutation("update", {
    input: updateTicket,
    resolve({ ctx, input }) {
      return ctx.prisma.ticket.update({
        where: {
          id: input.id,
        },
        data: {
          id: input.id,
          status: input.status as Status,
          messages: {
            push: input.message as string,
          }
        },
      });
    },
  })
  .mutation("create", {
    input: createTicket,
    resolve({ ctx, input }) {
      return ctx.prisma.ticket.create({
        data: {
          title: input.title,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          messages: [input.message],
          status: "PENDING",
        },
      });
    }
  })
  .mutation("delete", {
    input: selectTicket,
    resolve({ ctx, input }) {
      return ctx.prisma.ticket.delete({
        where: {
          id: input.id,
        },
      });
    }
  });

export default ticketRouter;

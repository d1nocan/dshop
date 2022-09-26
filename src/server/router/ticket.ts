import {
  selectTicket,
  updateTicket,
  createTicket,
  addMessage,
} from "@schemas/ticket";
import { createProtectedRouter } from "./protected-router";
import { Message, Role, Status } from "@prisma/client";

export const ticketRouter = createProtectedRouter()
  .query("get", {
    resolve({ ctx }) {
      return ctx.prisma.ticket.findMany({
        where: {
          ...(ctx.session.user.role !== Role.Admin
            ? { userId: ctx.session.user.id }
            : {}),
        },
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
        include: {
          user: true,
          messages: {
            include: {
              user: true,
            },
          },
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
        },
      });
    },
  })
  .mutation("addMessage", {
    input: addMessage,
    resolve({ ctx, input }) {
      return ctx.prisma.message.create({
        data: {
          content: input.content,
          createdAt: new Date(),
          ticket: {
            connect: {
              id: input.ticketId,
            },
          },
          user: {
            connect: {
              id: input.userId,
            },
          },
        },
      });
    },
  })
  .mutation("deleteMessage", {
    input: selectTicket,
    resolve({ ctx, input }) {
      return ctx.prisma.message.delete({
        where: {
          id: input.id,
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
          status: Status.Pending,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          messages: {
            create: {
              content: input.message,
              createdAt: new Date(),
              userId: ctx.session.user.id,
            } as Message,
          },
        },
      });
    },
  })
  .mutation("delete", {
    input: selectTicket,
    resolve({ ctx, input }) {
      return ctx.prisma.ticket.delete({
        where: {
          id: input.id,
        },
      });
    },
  });

export default ticketRouter;

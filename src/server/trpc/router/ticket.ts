import { selectTicket, updateTicket, createTicket, addMessage } from "@schemas/ticket";
import { t, authedProcedure } from "../trpc";
import { Message, Role, TicketStatus } from "@prisma/client";

export const ticketRouter = t.router({
    get: authedProcedure.query(({ ctx }) => {
        return ctx.prisma.ticket.findMany({
            where: {
                ...(ctx.session.user.role !== Role.Admin ? { userId: ctx.session.user.id } : {}),
            },
            include: {
                user: true,
            },
        });
    }),
    select: authedProcedure.input(selectTicket).query(({ ctx, input }) => {
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
    }),
    update: authedProcedure.input(updateTicket).mutation(({ ctx, input }) => {
        return ctx.prisma.ticket.update({
            where: {
                id: input.id,
            },
            data: {
                id: input.id,
                status: input.status as TicketStatus,
            },
        });
    }),
    addMessage: authedProcedure.input(addMessage).mutation(({ ctx, input }) => {
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
    }),
    deleteMessage: authedProcedure.input(selectTicket).mutation(({ ctx, input }) => {
        return ctx.prisma.message.delete({
            where: {
                id: input.id,
            },
        });
    }),
    create: authedProcedure.input(createTicket).mutation(({ ctx, input }) => {
        return ctx.prisma.ticket.create({
            data: {
                title: input.title,
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
    }),
    delete: authedProcedure.input(selectTicket).mutation(({ ctx, input }) => {
        return ctx.prisma.ticket.delete({
            where: {
                id: input.id,
            },
        });
    }),
});

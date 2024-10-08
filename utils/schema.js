import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const MockInterview =  pgTable("Interviewprep", {
    id: serial('id').primaryKey(),
    jsonMockResp: text('jsonMockResp').notNull(),
    jobPosition: varchar('jobPosition').notNull(),
    jobDesc: varchar('jobDesc').notNull(),
    jobExperience: varchar('jobExperience').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt: varchar('createdAt').default('now()'),
    mockId: varchar('mockId').notNull()
});

export const UserAnswer = pgTable("UserAnswer", {
    id: serial('id').primaryKey(),
    mockIdRef:varchar('mockId').notNull(),
    question:varchar('question').notNull(),
    correctAns:text('correctAns').notNull(),
    userAns:text('userAns'),
    feedback:text('feedback'),
    rating:varchar('rating'),
    userEmail:varchar('userEmail'),
    createdAt: varchar('createdAt'),
    
});
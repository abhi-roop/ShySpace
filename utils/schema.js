import { PgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const MockInterview = new PgTable('Interviewprep', {
    id: serial('id').primaryKey(),
    jsonMockResp: text('jsonMockResp'),
    jobPosition: varchar('jobPosition'),
    jobDesc: varchar('jobDesc'),
    jobExperience: varchar('jobExperience'),
    createdBy: varchar('createdBy'),
    createdAt: varchar('createdAt').default('now()'),
    mockId: varchar('mockId')
});

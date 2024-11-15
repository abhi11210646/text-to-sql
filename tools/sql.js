import { SQL_SCHEMA } from "../utils/sql-schema.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from '@langchain/core/output_parsers';


export default async function sql(llm, question) {
    const PROMPT_TEMPLATE = `
    You are a highly skilled SQL analyst. Your task is to convert a natural language query 
    into a syntactically correct SQL query based on the provided database schema.
   
    Use the database schema below delimited by triple backslashes '///'.
    ///
    ${SQL_SCHEMA}
    ///

    Instructions:
     - Only use database sql schema provided to you.
     - if it's not a database related question then return 0.
     - Do not generate DML statements.
     - Only generate SELECT query.

    Question: {question}
    SQL Query:
`;

    const prompt = ChatPromptTemplate.fromTemplate(PROMPT_TEMPLATE);

    let sqlChain = prompt.pipe(llm).pipe(new StringOutputParser());

    const sql_query = await sqlChain.invoke({
        question
    });
    return sql_query
}
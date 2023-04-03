import { Pagination, PaginationType } from "@discordx/pagination";
import type { ArgsOf, Client } from "discordx";
import {
    EmbedBuilder,
  } from "discord.js";  
import { Discord, On } from "discordx";

function GeneratePages(limit?: number) {
    const pages = Array.from(Array(limit ?? 20).keys()).map((i) => {
      return { content: `I am ${i + 1}`, embed: `Demo ${i + 1}` };
    });
    return pages.map((page) => {
      return {
        content: page.content,
        embeds: [new EmbedBuilder().setTitle(page.embed)],
      };
    });
  }
  
@Discord()
export class Example {
    @On({ event: "messageDelete" })
    onMessage([message]: ArgsOf<"messageDelete">, client: Client): void {
        console.log("Message Deleted", client.user?.username, message.content);
    }
    @On({ event: "messageCreate" })
    messageCreate([message]: ArgsOf<"messageCreate">): void {
      if (message.content === "paginated demo") {
        new Pagination(message, GeneratePages(), {
          type: PaginationType.Button,
        }).send();
      }
    }  
}
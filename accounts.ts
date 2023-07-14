import type { Account, Accounts, Catch } from './types';
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/.env' });

//todo
const lootFilterSettings: Record<Catch, string> = {
  "all": "",
  "nothing": "",
  "legend-only": ""
};
const quickGroupSettings = "";

const szarosc: Account = {
  login: process.env.szary_login as string,
  password: process.env.szary_haslo as string,
  catch: "all"
}

export const accounts: Accounts = {
  szarosc
}
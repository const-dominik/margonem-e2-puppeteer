import puppeteer, { Page } from 'puppeteer';
import type { Account, Mob } from './types';
import { accounts } from './accounts';

//TODO: 
// - podchodzenie do najblizszego mobka z obstawy e2
// - alert ze walczy z kim innym ??
// - occlusion

const selectors = {
  haveAnAccount: "p:nth-child(7) > a",
  login: "#login-input",
  password: "#login-password",
  signIn: "#js-login-btn",
  enter: ".c-btn.enter-game",
  game: "#centerbox",
  getE2Selector(img: string) {
    return `div[style*="background-image: url("][style*="${img}"]`;
  } 
};

const getHost = async (page: Page) => await page.evaluate(() => window.location.host);
const sleep = async (ms: number) => new Promise(res => setTimeout(res, ms));
const randomWait = (from: number, to: number) => Math.floor(Math.random() * (to-from)+1)+from;

const sendToDiscord = async (message: string): Promise<void> => {
  fetch("WH", {
    method: "POST",
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      content: message
    })
  });
}

const logInAccount = async (accountData: Account) => {
  const browser = await puppeteer.launch({
    protocolTimeout: 800000,
    args: [
      "--disable-features=CalculateNativeWinOcclusion"
    ],
    headless: false
  });
  const page = await browser.newPage();
  const MARGONEM = "https://www.margonem.pl/";
  
  await page.goto(MARGONEM);

  await page.waitForSelector(selectors.haveAnAccount);
  await page.click(selectors.haveAnAccount);

  await page.waitForSelector(selectors.login);
  await page.type(selectors.login, accountData.login);
  await page.type(selectors.password, accountData.password);
  await page.click(selectors.signIn);
  console.log("zalogowany")
  await page.waitForSelector(selectors.enter);
  await page.click(selectors.enter);

  
  //change cookies
  await page.setCookie({
    name: "interface",
    value: "si",
    domain: await getHost(page)
  });
  await page.setCookie({
    name: "__mExts",
    value: "v113825%2Cv114899%2Cv124338%2Cd149748",
    domain: await getHost(page)
  });
  
  await page.reload();
  await page.waitForFunction(() => window.g.init === 5 && window.map.loaded);
  console.log("dodatki zainstalowane");
  console.log("w grze");
  await page.focus(selectors.game);
  await page.evaluate(() => window.mAlert = () => {});
  while (true) {
    const E2 = await page.evaluate(async () => {
      return new Promise(res => {
        const old_newNpc = window.newNpc;
        window.newNpc = (mobs = {}) => {
          old_newNpc(mobs);
          Object.values(mobs).forEach(mob => {
            if (!mob.del && mob.wt > 19 && mob.wt < 30) {
              res(mob);
            }
          })
        }
      });
    }) as Mob;

    await page.waitForSelector(selectors.getE2Selector(E2.icon));
    //clicking on mob, the event is trusted so antibot won't catch it
    await page.click(selectors.getE2Selector(E2.icon));
    await page.evaluate((x, y) => new Promise(res => {
      setInterval(() => {
        if (Math.abs(window.hero.x - x) <= 1 && Math.abs(window.hero.y - y) <= 1) {
          //resolving a second later, so it won't try to attack mob while still walking
          setTimeout(() => res(true), 1000);
        }
      }, 200)
    }), E2.x, E2.y);
    await page.click(selectors.getE2Selector(E2.icon), { 'button': 'right' });
  }
};

Object.values(accounts).forEach(account => logInAccount(account));
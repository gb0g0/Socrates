const app = require("express")(); // For creating the server
const {
  Telegraf,
  session,
  Scenes: { Stage, WizardScene },
} = require("telegraf");
const dotenv = require("dotenv"); // For reading the .env file
dotenv.config({ path: "./config.env" }); // For reading the .env file
const bot = new Telegraf(process.env.BOT_TOKEN);
const twitter = require("./utils/twitter.js");
// const supabase = require("./utils/supabase.js");

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.supabaseUrl;
const supabaseKey = process.env.supabaseKey;
const supabase = createClient(supabaseUrl, supabaseKey);
//
// async function name() {
//   // Get a list of all the chats that the bot is in
//   const chats = await bot.getChats()

//   // Iterate over the list of chats and check the chat type of each chat
//   const groups = [];
//   for (const chat of chats) {
//     if (chat.type === "group") {
//       groups.push(chat.id);
//     }
//   }

//   // Get information about each group
//   const groupInfo = [];
//   for (const groupId of groups) {
//     const group = await bot.telegram.getChat(groupId);
//     groupInfo.push(group);
//   }

//   // Print the list of groups
//   console.log(groupInfo);
// }
// name()
//
const applyForAirdrop = new WizardScene(
  "apply for airdrop",
  async (ctx) => {
    ctx.reply(
      "Step 1: \n\nClick on the Link below to follow *Socrates* on X (fka Twitter). \n\nFollow Socrates: 👇 \nhttps://twitter.com/Socrates_xyz",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Done ✅",
                callback_data: "Next",
              },
              {
                text: "Restart 🔁",
                callback_data: "Restart",
              },
            ],
          ],
        },
      }
    );
    ctx.wizard.cursor = 0;
    return ctx.wizard.next();
  },
  async (ctx, rs = false) => {
    if (rs == true) {
      //   ctx.answerCbQuery();
      ctx.reply("Please provide your X (fka Twitter) username:");
      ctx.wizard.cursor = 1;
      return ctx.wizard.next();
    } else {
      if (ctx.callbackQuery == undefined) {
        await ctx.reply("Incorrect input");
        await ctx.scene.leave();
        await ctx.scene.enter("apply for airdrop");
      } else if (ctx.callbackQuery.data == "Restart") {
        await ctx.reply("Restarting.....");
        await ctx.scene.leave();
        await ctx.scene.enter("apply for airdrop");
      } else if (ctx.callbackQuery.data == "Next") {
        ctx.answerCbQuery();
        ctx.reply("Please provide your X (fka Twitter) username:\n\n⚠Ps: without @");
        ctx.wizard.cursor = 1;
        return ctx.wizard.next();
      }
    }
  },
  async (ctx) => {
    if (ctx.message.text) {
      const twitterUsername = ctx.message.text;
      ctx.wizard.state.twitterUsername = twitterUsername;
      await ctx.reply(`Your X (fka Twitter) Username is: ${twitterUsername}`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Continue ✅",
                callback_data: "Continue",
              },
              {
                text: "Change ⚠",
                callback_data: "Change",
              },
            ],
          ],
        },
      });
      ctx.wizard.cursor = 2;
      return ctx.wizard.next();
    }
  },
  async (ctx, rs = false) => {
    const reply = () => {
      ctx.reply(
        "Step 2: \n\nClick on the Link below to Join Socrates Telegram Group. \n\nJoin Telegram Group: 👇 \nhttps://t.me/socratesglobal",
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Done ✅",
                  callback_data: "Next",
                },
                {
                  text: "👈 Back",
                  callback_data: "Back",
                },
              ],
            ],
          },
        }
      );
    };
    if (rs == true) {
      await ctx.reply("Wrong Input ... ❌");
      reply();
      ctx.wizard.cursor = 3;
      return ctx.wizard.next();
    } else {
      if (ctx.callbackQuery == undefined) {
        await ctx.reply("Wrong Input...❌");
        return ctx.wizard.steps[1](ctx, true);
      } else if (ctx.callbackQuery.data == "Change") {
        return ctx.wizard.steps[1](ctx, true);
      } else {
        reply();
        ctx.wizard.cursor = 3;
        return ctx.wizard.next();
      }
    }

    // }
  },
  async (ctx, rs = false) => {
    if (ctx.callbackQuery == undefined) {
      return ctx.wizard.steps[3](ctx, true);
    } else if (ctx.callbackQuery.data == "Next") {
      ctx.answerCbQuery();
      ctx.replyWithHTML(
        "Step 3: \n\nClick on the Link below to Signup on Socrates's Website. \n\nSignup Here: 👇 \n<a href='https://app.socrates.xyz/registerWallet?ref=8k6dyvst'>https://app.socrates.xyz/registerWallet</a>",
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Done ✅",
                  callback_data: "Next",
                },
                {
                  text: "👈 Back",
                  callback_data: "Back",
                },
              ],
            ],
          },
        }
      );

      ctx.wizard.cursor = 4;
      return ctx.wizard.next();
    } else {
      ctx.answerCbQuery();

      return ctx.wizard.steps[0](ctx);
    }
  },
  async (ctx) => {
    if (ctx.callbackQuery == undefined) {
      await ctx.reply("Incorrect input");
      return ctx.wizard.steps[4](ctx);
    } else if (ctx.callbackQuery.data == "Back") {
      ctx.answerCbQuery();
      return ctx.wizard.steps[3](ctx);
    } else {
      ctx.answerCbQuery();
      ctx.reply("Please provide your Socrates Username:");
      ctx.wizard.cursor = 5;
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    if (ctx.message.text) {
      const socratesId = ctx.message.text;
      ctx.wizard.state.socratesId = socratesId;
      await ctx.reply(`Your Socrates Username is: ${socratesId}`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Continue ✅",
                callback_data: "Continue",
              },
              {
                text: "Change ⚠",
                callback_data: "Change",
              },
            ],
          ],
        },
      });
      ctx.wizard.cursor = 6;
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    ctx.reply(
      "Step 4: \n\nClick on the Link below to Join Socrates's Discord Channel. \n\nJoin Here: 👇 \nhttps://discord.gg/socrates \n\nSubscribe to YT Channel: 👇 \nhttps://www.youtube.com/channel/UC0xuO-731WtFXHygD7JC69g",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Done ✅",
                callback_data: "Next",
              },
              {
                text: "👈 Back",
                callback_data: "Back",
              },
            ],
          ],
        },
      }
    );
    ctx.wizard.cursor = 7;
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.callbackQuery == undefined) {
      await ctx.reply("Incorrect input");
      return ctx.wizard.steps[7](ctx);
    } else if (ctx.callbackQuery.data == "Back") {
      ctx.answerCbQuery();
      return ctx.wizard.steps[5](ctx);
    } else {
      ctx.answerCbQuery();
      ctx.reply("Please provide your Discord Id:");
      ctx.wizard.cursor = 8;
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    if (ctx.message.text) {
      const discordId = ctx.message.text;
      ctx.wizard.state.discordId = discordId;
      await ctx.reply(`Your Discord Id is: ${discordId}`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Continue ✅",
                callback_data: "Continue",
              },
              {
                text: "Change ⚠",
                callback_data: "Change",
              },
            ],
          ],
        },
      });
      ctx.wizard.cursor = 9;
      return ctx.wizard.next();
    }
  },

  async (ctx, rs = false) => {
    const reply = () => {
      ctx.reply(
        "Woohoo 🎉🥳, You are almost there \n\nPlease provide your polygon wallet address:"
      );
    };
    if (rs == true) {
      //   ctx.answerCbQuery();
      reply();
      ctx.wizard.cursor = 10;
      return ctx.wizard.next();
    } else {
      if (ctx.callbackQuery == undefined) {
        await ctx.reply("Incorrect input");
        return ctx.wizard.steps[9](ctx);
      } else if (ctx.callbackQuery.data == "Change") {
        return ctx.wizard.steps[8](ctx);
      } else {
        ctx.answerCbQuery();
        reply();
        ctx.wizard.cursor = 10;
        return ctx.wizard.next();
      }
    }
  },
  async (ctx) => {
    if (!ctx.message.text.includes("0x")) {
      await ctx.reply("Invalid Address");
      return ctx.wizard.steps[10](ctx, true);
    } else if (ctx.message.text) {
      const wallet = ctx.message.text;
      ctx.wizard.state.wallet = wallet;
      await ctx.reply(`Your Polygon Wallet is: ${wallet}`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Continue ✅",
                callback_data: "Continue",
              },
              {
                text: "Change ⚠",
                callback_data: "Change",
              },
            ],
          ],
        },
      });
      ctx.wizard.cursor = 11;
      return ctx.wizard.next();
    } else {
      await ctx.reply("Invalid input");
      return ctx.wizard.steps[10](ctx, true);
    }
  },
  async (ctx) => {
    const chat_id = ctx.chat.id;
    const user_name = ctx.chat.username;
    const twitter_handle = ctx.wizard.state.twitterUsername;
    const discord_id = ctx.wizard.state.discordId;
    const wallet = ctx.wizard.state.wallet;
    const socrates_id = ctx.wizard.state.socratesId;
    if (ctx.callbackQuery == undefined) {
      ctx.answerCbQuery();
      ctx.reply("Wrong Input.....");
      return ctx.wizard.steps[10](ctx);
    } else if (ctx.callbackQuery.data == "Change") {
      return ctx.wizard.steps[10](ctx);
    } else {
      ctx.answerCbQuery();

      const { data, error } = await supabase.from("users").insert([
        {
          chat_id,
          user_name,
          twitter_handle,
          discord_id,
          wallet,
          socrates_id,
        },
      ]);

      if (error) {
        console.log(error);
        ctx.reply("An error occured 😔, Please try again 🔁");
        await ctx.scene.leave();
        // await ctx.scene.enter("apply for airdrop");
      } else {
        await ctx.reply(
          "Woohoo 🎉🥳, You have been added to the list! 📝✅ \n\nWe will verifiy your information and get back to you \n\nVIP 1 Airdrop completed ✅: \n• Enter the drop telegram bot ✅ \n• Follow Socrates social media ✅ \n• Register and Submit your wallet ✅"
        );

        await ctx.reply(
          `Your Information: \n\n Username:${user_name} \n X handle: ${twitter_handle} \n Discord Id: ${discord_id} \n Wallet: ${wallet}`
        );
        await ctx.reply(
          "🚨 Proceed to participate to other Task 🚨 \n\n\n💰 VIP 2 Airdrop Task: \n\nBenefits: VIP 2 Airdrop users can win $10 - $20 daily by answering Questions on Socrates site and have a greater percentage of the airdrop rewards than VIP 1 \n\n✍ How To Participate:\n\n• Navigate to your wallet on your Socrates account \n• Scroll down and Find SBT \n• Mint the SBT Pen worth $10 \n• Answer Questions on Socrates website \n\n\n💰 VIP 3 Airdrop Task: \n\nVIP 3 Airdrop users can win $20 - $30 daily by answering Questions on Socrates site and have a greater percentage of the airdrop rewards than VIP 2\n\n✍ How To Participate: \n\n• Navigate to your wallet on your Socrates account \n• Scroll down and Find SBT\n• Mint the SBT Pen worth $100\n• Answer Questions on Socrates website \n\n\n💰 VIP 4 Airdrop Task: \n\n• Navigate to your wallet on your Socrates account \n• Scroll down and Find SBT\n• Mint the SBT Pen worth $300\n• Answer Questions on Socrates website \n\n\n💰 Airdrop Distribution Priority 💰: \n\nVIP 4: 40% of Airdrop Supply \nVIP 3: 30% of Airdop Supply \nVIP 2: 20% of Airdop Supply \nVIP 1: 10% of Airdop Supply \n\n\n🔁Referral program: \n\nYou can use your referral link on the Socrates application to bring new users to the platform, referral rewards are shown below: \n\nEach Referral For VIP 1 User: \n• 0.1$ per Referral\n• 0.5$ per paid Referral \n\nEach Referral For VIP 3 User: \n• 0.3$ per Referral \n• 1.5$ per paid Referral \n\nEach Referral For VIP 4 User: \n• 0.4$ per Referral \n• 2$ per paid Referral \n\n\n🚨 Airdroppers with higher VIP Levels and Referrals will be prioritize in the distribution"
        );

        ctx.scene.leave();
      }
    }
  }
);

// const menu = new WizardScene("menu options", async (ctx) => {

// });

session({
  property: "chatSession",
  getSessionKey: (ctx) => ctx.chat && ctx.chat.id,
});
bot.use(session());

const stage = new Stage([applyForAirdrop], { sessionName: "chatSession" });
bot.use(stage.middleware());
stage.register(applyForAirdrop);

// const menus = new Stage([menu], { sessionName: "chatSession" });
// bot.use(menus.middleware());
// menus.register(menu);

bot.command("start", async (ctx) => {
  ctx.scene.enter("apply for airdrop");
});
bot.command("menu", async (ctx) => {
  ctx.reply("Wait i'm still building");
});

bot.launch();
app.listen(3000, () => {
  console.log("listening at 3000");
});

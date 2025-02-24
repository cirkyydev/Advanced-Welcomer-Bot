/* 
Fully Customized Advanced Welcomer Discord Bot in Discord.js V14
Hope you Enjoy, Made with 🤍 by CalledMasih
Github: https://github.com/calledmasih | Please Don't forget to ⭐
Website: https://calledmasih.ir/
Features: Exclusive Joined role for human and bot users, DM Welcomer with Embed, Buttons and the Server Invite Link, Welcoming to the NEW members in the specific channel, Ping on Join, Log System for this Information, Set the current Server Member Count to a Voice channel's Name and more...
Copyright Masih 2023 All Right Reserved!
*/

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActivityType,
} = require("discord.js");
const config = require("./config.json");
// Create a new client | Don't change the intents
const express = require('express')
const app = express()
const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

process.on("unhandledRejection", (reason, promise) => {
  try {
    console.error(
      "Unhandled Rejection at: ",
      promise,
      "reason: ",
      reason.stack || reason
    );
  } catch {
    console.error(reason);
  }
});

// Emitted When member joined to the server
client.on("guildMemberAdd", async (member) => {
  // Ignore and Add a specific role to bot users
  if (member.user.bot) {
    member.roles.add(config.welcomeBotRoleId); // If You don't want to add a role to bots, Simply only use "return" in this line
  } else {
    const welcomeChannel = member.guild.channels.cache.get(
      config.welcomeChannelId
    );
    // If the welcome channel is not found, all of the remaining action are return
    if (!welcomeChannel) {
      return console.log(
        "I can't find the welcome channel, Please set the channel ID in config.json"
      );
    }
    // Create a permanent & unlimited Discord invite link from the entered welcome channel
    const welcomeInvitesLink = await welcomeChannel.createInvite({
      maxAge: 0,
      maxUses: 0,
    });
    // DM Welcomer
    const welcomeDMEmbed = new EmbedBuilder()
      .setTitle(
        `Hey ${member.user.username}, Merhba bek f **__${
          member.guild.name
        }__** [${member.guild.memberCount.toLocaleString()}]`
      )
      .setURL("https://calledmasih.ir/")
      .setDescription(config.dmWelcomerDescription || "No Data was filled out")
      .setThumbnail(member.guild.iconURL({ size: 1024 }))
      .setColor(member.guild.members.me.displayHexColor)
      .setFooter({
        text: `Sent from: ${member.guild.name}`,
        iconURL: member.user.displayAvatarURL({
          size: 1024,
        }),
      })
      .setTimestamp();
    // If this server has a banner (Required Server Boost Level 2), this banner URL's image is added to DM embed
    if (member.guild.bannerURL()) {
      welcomeDMEmbed.setImage(
        member.guild.bannerURL({
          size: 1024,
        })
      );
    }
    // 4 Link Buttons
    const welcomeDMRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel(config.dmWelcomerLinkButtons.first.label || "No Data")
        .setURL(
          config.dmWelcomerLinkButtons.first.url || "https://calledmasih.ir"
        )
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel(config.dmWelcomerLinkButtons.second.label || "No Data")
        .setURL(
          config.dmWelcomerLinkButtons.second.url || "https://calledmasih.ir"
        )
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel(config.dmWelcomerLinkButtons.third.label || "No Data")
        .setURL(
          config.dmWelcomerLinkButtons.third.url || "https://calledmasih.ir"
        )
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel(config.dmWelcomerLinkButtons.fourth.label || "No Data")
        .setURL(
          config.dmWelcomerLinkButtons.fourth.url || "https://calledmasih.ir"
        )
        .setStyle(ButtonStyle.Link)
    );
    // 1 Disabled Red Button in another row for show member username
    const welcomeDisableDMRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("Disabled Button")
        .setLabel(member.user.username)
        .setEmoji("🎉")
        .setStyle(ButtonStyle.Danger) // You can set Danger to: Primary (Blue), Success (Green) or Secondary (White)
        .setDisabled(true)
    );
    // Send the Information to the member's DM
    member
      .send({
        content: `** ${welcomeInvitesLink} **`,
        embeds: [welcomeDMEmbed],
        components: [welcomeDMRow, welcomeDisableDMRow],
      })
      .then(() => {})
      .catch(() => {
        console.error(
          `Discord API error: Cannot send a messages to ${member.user.username}'s DM, It's seems that this member has closed his DM\nBut other actions are running now!`
        );
      });
    // Welcome in the Specific channel
    const welcomeEmbed = new EmbedBuilder()
      .setAuthor({
        name: `Salam ${member.user.username}, Merhba bek f ${
          member.guild.name
        } [${member.guild.memberCount.toLocaleString()}]`,
        iconURL: member.user.displayAvatarURL({
          size: 1024,
        }),
      })

      .setColor(member.guild.members.me.displayHexColor)
      .setFooter({
        text: `ID: ${member.user.id}`,
        iconURL: member.guild.iconURL({
          size: 1024,
        }),
      })
      .setTimestamp();

    const welcomeRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel(config.welcomeChannelLinkButton.label || "No Data")
        .setEmoji("988331472614215680")
        .setURL(config.welcomeChannelLinkButton.url || "https://calledmasih.ir")
        .setStyle(ButtonStyle.Link)
    );
    // Send the Embed Message to your welcome channel
    welcomeChannel
      .send({
        content: `${member}`,
        embeds: [welcomeEmbed],
        components: [welcomeRow],
      })
      // Delete the welcome messages after 1.5 minutes
      .then((welcome) => {
        setTimeout(function () {
          welcome.delete();
        }, 90000);
      });
    // Auto joined role (Only for Real human users)
    member.roles
      .add(config.welcomeRoleId)
      .then(() => {})
      .catch(() => {
        console.error(
          `Cannot add this joined role to the ${member.user.username}\nMake sure the role ID that entered in the config.json file is correct and i have the enough permissions`
        );
      });
  }
  // Welcomer Log messages (Includes some member's Information)
  const memberValidation = member.user.bot ? "Application Bot" : "Member";
  const welcomeLogChannel = client.channels.cache.get(
    config.welcomeLogChannelId
  );
  // If the welcome channel log is not found, all of the remaining action are return
  if (!welcomeLogChannel) {
    return console.log(
      "I can't find the welcome channel log, Please make sure to set the welcomeChannelId in config.json file"
    );
  }
  const welcomeLogEmbed = new EmbedBuilder()
    .setAuthor({
      name: `NEW ${memberValidation} was Joined`,
      iconURL: `${member.user.displayAvatarURL({
        size: 1024,
      })}`,
    })
    .setDescription(
      `**${member} | ${
        member.user.tag
      } | ${member.guild.memberCount.toLocaleString()} Members**` // Member count
    )
    .addFields(
      {
        name: `Badges:`,
        value: `${member.user.flags.toArray().join(", ") || "No Badges"}`,
        inline: false,
      }, // The all badges of this member
      {
        name: `Account Created at:`,
        value: `<t:${Math.round(
          member.user.createdTimestamp / 1000
        )}:f> | <t:${Math.round(member.user.createdTimestamp / 1000)}:R>`,
        inline: false,
      }, // When this member's account is created
      {
        name: `Joined Server at:`,
        value: `<t:${Math.round(
          member.joinedTimestamp / 1000
        )}:f> | <t:${Math.round(member.joinedTimestamp / 1000)}:R>`,
        inline: false,
      } // When this member has joined the server
    )
    .setThumbnail(
      `${member.user.displayAvatarURL({
        size: 1024,
      })}`
    ) // This member avatar URL
    .setColor("32ff81")
    .setFooter({
      text: `ID: ${member.user.id}`,
      iconURL: member.guild.iconURL({ size: 1024 }),
    }) // This member's ID and Avatar of the server that this member has joined
    .setTimestamp();
  welcomeLogChannel.send({ embeds: [welcomeLogEmbed] });

  // Ping On Join System (Mention your member to this channel when joined)
  const pingOnJoinChannel = client.channels.cache.get(
    config.pingOnJoinChannelId
  );
  // If the ping on join channel is not found, all of the remaining action are return
  if (!pingOnJoinChannel) {
    return console.log(
      "I was unable to find your ping on join channel, make sure to set the 'pingOnChannelId' in the config.json file"
    );
  }
  pingOnJoinChannel
    .send({ content: `${member}` })
    .then((msg) => {
      setTimeout(() => {
        msg.delete();
      }, 3000); // Delete the ping on join content after 3 seconds
    })
    .catch((err) => {
      console.error(
        `An error occurred while pinging this member: ${member.user.username} to the ${pingOnJoinChannel.name} channel\nCurrent Error can be find here: ${err}`
      );
    });
});

// When the client is ready
client.on("ready", async () => {
  const memberCountVoiceChannel = client.channels.cache.get(
    config.displayMemberCountVoiceChannelId
  );
  // Set status and activity for the logged in client
  client.user.setPresence({

    // You can go for: online, idle, dnd and invisible in the config.json file
    status: config.botStatus || "online",
      activities: [{
        name: config.presence ? config.presence : config.botActivityName || "No Data was filled out",
        type: ActivityType.Streaming,
        url: "https://www.twitch.tv/ctradess"
      }]
  });
  // Edit the channel name to current guild members count and refresh the data every 15 minutes
  const ms = 900_000;
  if (ms < 360_000) {
    console.log(
      "Be careful, according to the Discord API TOS, the minimum time required to edit a channel is every 6 minutes, so please make your time more than 360,000 milliseconds."
    );
  }
  setInterval(() => {
    memberCountVoiceChannel.setName(
      `👥〢Members: ${memberCountVoiceChannel.guild.memberCount}`
    );
  }, ms);
  console.log(
    `${client.user.username} is now online and enjoy your advanced welcomer!\nGitHub: https://github.com/calledmasih | If is useful please don't forget to follow me and star my repository ⭐\nTotal Servers: ${client.guilds.cache.size}`
  );
});

// Log in to your Client
client.login(config.botToken);

/*
  ❓ Don't forget to filled out config.json file by your information and check the README.md file
  All of the methods have been carefully tested and without any bugs
  But if you have any issues while using this source, feel free to contact me thorough my social media which is @CalledMasih
  */

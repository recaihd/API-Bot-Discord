import { Client, IntentsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import * as dotenv from "dotenv";
import axios from "axios";
import fs from "fs";

dotenv.config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
});

const YT_API_KEY = process.env.YT_API_KEY;
const CHANNEL_ID = "UCTlbXUMPYyKgj1-GrxuKpag"; // Seu canal
const DISCORD_CHANNEL_ID = "1314686573434114148"; // id do canal do discord

let lastVideoId = "";

// Carregar último vídeo salvo
try {
  if (fs.existsSync("lastVideo.json")) {
    const data = fs.readFileSync("lastVideo.json", "utf8");
    const parsed = JSON.parse(data);
    lastVideoId = parsed.lastVideoId || "";
  } else {
    fs.writeFileSync("lastVideo.json", JSON.stringify({ lastVideoId: "" }), "utf8");
  }
} catch (err) {
  console.error("Erro ao ler lastVideo.json:", err);
}

async function getChannelInfo() {
  const res = await axios.get(`https://www.googleapis.com/youtube/v3/channels`, {
    params: {
      part: "snippet",
      id: CHANNEL_ID,
      key: YT_API_KEY
    }
  });
  return res.data.items[0]?.snippet || {};
}

async function getLatestVideos() {
  const res = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
    params: {
      part: "snippet",
      channelId: CHANNEL_ID,
      order: "date",
      maxResults: 5,
      key: YT_API_KEY
    }
  });
  return res.data.items || [];
}

async function checkForNewVideos() {
  try {
    const channelInfo = await getChannelInfo();
    const videos = await getLatestVideos();
    const newVideos = [];

    for (const video of videos) {
      if (video.id.videoId === lastVideoId) break;
      newVideos.unshift(video);
    }

    if (newVideos.length === 0) return;

    const discordChannel = await client.channels.fetch(DISCORD_CHANNEL_ID);

    for (const video of newVideos) {
      const videoId = video.id.videoId;
      
      // Forçar a melhor thumbnail possível (evita bordas pretas pegando apenas maxres)
      const thumb = video.snippet.thumbnails.maxres?.url || 
                    video.snippet.thumbnails.high?.url || 
                    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

      // Ajustar descrição: manter quebras de linha, emojis e limitar 4000 caracteres
      const description = (video.snippet.description || "Novo vídeo no canal!")
        .slice(0, 4000)
        .replace(/\n/g, "\n");

      const embed = new EmbedBuilder()
        .setTitle(video.snippet.title)
        .setURL(`https://www.youtube.com/watch?v=${videoId}`)
        .setDescription(description)
        .setImage(thumb)
        .setColor(0xff0000)
        .setAuthor({
          name: channelInfo.title || "Canal",
          iconURL: channelInfo.thumbnails?.default?.url || ""
        })
        .setTimestamp(new Date(video.snippet.publishedAt));

      const button = new ButtonBuilder()
        .setLabel("Assistir")
        .setStyle(ButtonStyle.Link)
        .setURL(`https://www.youtube.com/watch?v=${videoId}`);

      const row = new ActionRowBuilder().addComponents(button);

      if (discordChannel.isTextBased()) {
        discordChannel.send({
          content: "<@&1402429912794660874> RecaiHD Postou um vídeo!",
          embeds: [embed],
          components: [row],
        });
      }

      lastVideoId = videoId;
      fs.writeFileSync("lastVideo.json", JSON.stringify({ lastVideoId }), "utf8");
    }
  } catch (error) {
    console.error("Erro ao verificar vídeos:", error);
  }
}

client.on("ready", () => {
  console.log(`${client.user.tag} está online!`);
  checkForNewVideos();
  setInterval(checkForNewVideos, 60 * 1000);
});

client.login(process.env.TOKEN);

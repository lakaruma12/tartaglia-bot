require('dotenv').config();

const {Client, Util} = require('discord.js');
const client = new Client();
const ytdl = require('ytdl-core')
const PREFIX = '!!';
const queue = new Map()

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in`)
});

client.on('message', (message) => {
    console.log(`[${message.author.tag}]: ${message.content}`);
});

const Manager = require('./sharder/manager/Manager')
const manager = new Manager()

manager.start()

process.on('unhandledRejection', bot.logger.error);

process.on('uncaughtException', err => {
    bot.logger.error(err);
    throw new Error('Something went wrong');
});


client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${PREFIX}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${PREFIX}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${PREFIX}stop`)) {
    stop(message, serverQueue);
    return;
  } else {
    message.channel.send("You need to enter a valid command!");
  }
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
   };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue! <a:CatRave:802728255647383572> `);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip! <a:childespank_seseren:802726420559560776> ");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
    
  if (!serverQueue)
    return message.channel.send("There is no song that I could stop! <a:childespank_seseren:802726420559560776> ");
    
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}  function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Now playing: <a:ataylaugh:802233323274502164>  **${song.title}** <a:neonblob:798845628481536000> ! `);
}
 //music commands


let replies = ["Luv you too~", "ah~ i got simp~ im dying~", "so that what it feels like, to be simp by someone else","Pathetic.","love me? you should love yourself", "Yeah, I know you're a stranger but I'm likin' the danger"];
let songs = ["Got no anger, got no malice Just a little bit of regret", "", "Im sorry, the old taylor can't come to the phone right now, why? oh... cuz she's dead!", "Nice to meet you where you been? I can show you incredible things!","Wish i were heather...","Cuz the haters gonna hate hate hate hate hate","Can i go where you go? Can we always be this close? Forever and ever?","Hold up, they dont love you like i love you","Now from the top, make it drop thats some WAP","Can you stay up all night? ---- till the daylight? 34+35~~~","Losing him was blue like I'd never known missing him was dark grey, all alone forgetting him was like trying to know somebody you never met but loving him was red","Switchin' my positions for you~ cookin' in the kitcher and im in the bedroom~","I knew you were trouble when you walked in","There's some ---- that i, usually dont do, but for you i kinda kinda want to","cuz you're down for me and im down too yeah im down too~ switchin' my positions for you~","Why would you ever kiss me? Im not even half as pretty","you gave her your sweater, its just polyester but you like her better...","I came in like a wrecking ball, i never hit so hard in love","And life, is like a pipe and im a tiny penny rolling up the walls inside","All i ask is if, this is my last night with you, hold me like im more than just a friend ***Your chance is here guess the correct answer and <:ChildeMora_Wilock:802728158481874974>  win upto 500 tatsu points!*** ","We are never ever ever ever getting back together","And you calls me like I still love you and im like this is exhausting like you knwo were never getting back together, like ever","Nevermind i'll find, someone like you, i wish nothing but the best, for you too","And i set fire to the rain","Cuz i in the stars tonigh, so watch me bring that fire set the night alight","알람이 울려대 ring ring a ling","서로의 눈길이 닿을 때마다","We are the lovesick girls 네 멋대로 내 사랑을 끝낼 순 없어"];
let quotes = ["Sarcasm falls out from my mouth kinda like stupidity falling out from yours.", "Love means money these days", "Time can heal many wounds but it wont heal everything","God may forgive your faults, but im not God","Maybe it is true, that people care when its too late","Im trying to stay strong but sometimes i break", "You didnt actually love me at all did you?", "would you still love me if i were a slimy wet octopus only crawled around?"];
let sign = ["*blaugh*", "hunt", "die","angry","leave"];
let beg = ["congrats! you won! with the price of fresh air you are breathing!", "no, you won nothing", "eh? begging me? ahh... *Tartaglia-bot is now not responding*","no- stop- i have no money-","leave me alone...", "ahhhhhhhhhhhh, no","can we... ehhh... meh? no?","somebody help me","beuh","bruh","congrats! you won! a 100 tatsu points! congrats eh? but first, let me tell my master... <@!345803311536144398> ","no way on earth you will win anything from me", "love's a game, wanna play? its more fun than begging money!","if you were a little less more into conversations, and more into touching my body, you will find more money in my clothes rather than begging from me cause i will never give you","huh? y-you? asking for money from me? i- thats so scandalous, i like it. Take my money, i simp for you with 200 tatsu points. <@!345803311536144398> pls pay for me my master~","nah","no.","ask carl maybe?","ask my master.","ask Ariana Grande?","ask Cardi B!","ask Taylor Swift","let me think... ye-no, NO"];
let flex = ["Ofc, 'cause I'm the only one that has made you fall in love", "Well im handsome, rich, have eight-pack abs. Enough?", "Im so tall, the weather up here is actually nice","Im so handsome, everyone is falling for me","I have blue eyes, yes, the eyes that you've always wanted."];
let illegal = ["here, have some molly", "wanna laundry some money?", "whats cocaine?","who's smoking?","what are you doing? ecstasy?"];
client.on('message', (message) => {
    if (message.author.bot) return;
    var str = (`[${message.content}]`);
    {let random = Math.floor(Math.random() * illegal.length);
    if (message.content === 'Tartaglia, show me something illegal') {
        message.channel.send(illegal[random])
    }}
    {let random = Math.floor(Math.random() * beg.length);
    if (message.content === 'Tartaglia, can you give me some money?') {
        message.channel.send(beg[random])
    }}
    {let random = Math.floor(Math.random() * sign.length);
    if (message.content === 'Tartaglia, give us a sign') {
        message.channel.send(sign[random])
    }}
    {let random = Math.floor(Math.random() * quotes.length);
    if (message.content === 'Tartaglia, be depressed') {
        message.channel.send(quotes[random])
    }}
    {let random = Math.floor(Math.random() * songs.length);
    if (message.content === 'Tartaglia, give me some songs') {
        message.channel.send(songs[random])
    }}
    {let random = Math.floor(Math.random() * replies.length);
    if (message.content === 'Tartaglia, i love you') {
        message.channel.send(replies[random])
    }}
    {let random = Math.floor(Math.random() * flex.length);
      if (message.content === 'Tartaglia, can you flex?') {
          message.channel.send(flex[random])
      }}
}); //random replies

client.on('message', (message) => {
    if (message.author.bot) return;
    if (message.content === 'hello tartaglia') {
        message.reply('Hello! My name is Tartaglia! I also known as Childe! Warm and friendly one minute, ruthless killer the next! I love the thrill of feelings to be in the battles! I am here to be friends with everyone! But beware, i am very attractive indeed! (And will most likely to kill you if ur not being nice)')
    }
    if (message.content === 'Tartaglia, give me some ice cream') {
        message.channel.send('🍨 Ice cream~ chillin chillin~ there you go bb! <a:pinkhearts:798845516695732238> ')
    }
    if (message.content === 'Good morning') {
        message.reply('Good morning dear! Ur raring to go today, I see.')
    }
    if (message.content === 'good afternoon') {
        message.reply('Hey! Fancy to have lunch with me?')
    }
    if (message.content === 'hi tartaglia') {
        message.reply('HI! Im No. 11 of the Fatui Harbingers, codename Childe, but I also go by Tartaglia. And you... Hmm, you too like to cause quite the stir, dont you? Something tells me we are going to get along splendidly.')
    }
    if (message.content === 'good morning afternoon evening') {
        message.reply('What? You know... i hate people who are indecisive... and anyone whom i hate, usually got killed by me. So...')
    }
    if (message.content === 'Tartaglia, give me some money') {
        message.channel.send('Go find some job people... or type here ***tg!beg*** and risk some amount of your fortune')
    }
    if (message.content === 'tg!help') {
        message.reply('**Hello!** My name is Tartaglia, i also known as Childe! <:tartaglia1:798770628634476594> Here are the list of what i can do! I can give you some songs with hype lyrics by simple typing <a:4745_thisr:798123998424465429> ***"Tartaglia, give me some songs"***. And we also held daily lyrics finding campaign by guessing the name of the given lyrics!    I can also give you some quotes by this command <a:4745_thisr:798123998424465429> ***"Tartaglia, be depressed"***. Want the maximum level of cringeness? just type <a:4745_thisr:798123998424465429> ***"Tartaglia, i love you"*** and you will find out why. <a:neonblob:798845628481536000> You can also see my master contact by this command: <a:4745_thisr:798123998424465429>***"tg!contact"*** Every commands are case sensitive! My master: *Giyuu#8128* <a:bulbyroll:798846200072634389>  ')
    }
    if (message.content === 'tg!contact') {
        message.reply('**Hello!** Here are different ways you can contact my master: Discord: *Giyuu#8128* You can dm him or tag him here! He will usually reply within an hour! Make sure to tell him if there is any usage problems! Thank you! <:BennettThumbsUp:801300658153979955>   ')
    }
    if (message.content === 'Tartaglia, give me your address') {
        message.channel.send('My address is 23 Cornelia Street, New York, NY 10014, USA. You can take <a:4745_thisr:798123998424465429>  <:A_:802529020134031400> ,<:C_:802530080080265217> ,<:E_:802530080168738857> ,<:B_:802530080403881994> ,<:D_:802530080370065448> ,<:F_:802530080190496789> ,<:M_:802530080315670588>  subway to the **W 4 St - Wash Sq station** and then walk for 2 mins on 6th Ave then take a sharp left turn onto Cornelia Street and you will see 23 Cornelia Street on your right hand side! ')
    }
    if (message.content === 'tg!announcement') {
      message.channel.send('Hi guys! its Tartaglia! I just wanna say that I will be running a long term coding break so this channel will be put under lockdown for some time ;-; Until we meet again, sweet-honey-sugar coated, the one and only, *Tartaglia.* xoxo <:ChildeToys_Soreko:802723844275306556>')
  }
}); //direct replies and help options


client.login(process.env.DISCORDJS_BOT_TOKEN);

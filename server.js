const { Telegraf, session } = require('telegraf');
const schedule = require('node-schedule');

const BOT_TOKEN = '7641883110:AAHnqWwkh7EOaVlLnifB7mB3GjahqIWg_SI' // Mengambil token bot dari credentials.json

const bot = new Telegraf(BOT_TOKEN);
bot.use(session());




// Start Command
bot.start((ctx) => {
    console.log(`[LOG] User ${ctx.from.username} started the bot.`);
    ctx.reply('Command : /tesreminder /mulailatihan');
});


let reminders = {};

// Fungsi untuk mengirim pengingat
function sendReminder(ctx, message) {
    const chatId = "1133658666"
    const id = Math.floor(10 + Math.random() * 90); // Generate ID 2 digit
    reminders[id] = setInterval(() => {
        ctx.telegram.sendMessage(chatId, `${message} (ID: ${id})\nKetik /confirm ${id} untuk berhenti.`);
    }, 60000); // Kirim setiap 1 menit
}

// Jadwal pengingat sholat
const schedules = [
    { time: '0 4 * * *', message: 'Ayo Sholat Subuh' },
    { time: '48 12 * * *', message: 'Persiapan Sholat Dzuhur' },
    { time: '20 15 * * *', message: 'Persiapan Sholat Ashar' },
    { time: '30 17 * * *', message: 'Mandi dan Persiapan Magrib' },
    { time: '30 18 * * *', message: 'Persiapan Sholat Isya' }
];

// Menjadwalkan pengingat
schedules.forEach(({ time, message }) => {
    schedule.scheduleJob(time, function () {
        const chatId = '1133658666'; // Ganti dengan chat ID yang sesuai
        sendReminder(bot, chatId, message);
    });
});

// Command untuk konfirmasi dan menghentikan pengingat
bot.command('confirm', (ctx) => {
    const args = ctx.message.text.split(' ');
    const id = args[1];
    
    if (reminders[id]) {
        clearInterval(reminders[id]);
        delete reminders[id];
        ctx.reply(`Pengingat dengan ID ${id} telah dihentikan.`);
    } else {
        ctx.reply(`ID ${id} tidak ditemukan atau sudah dihentikan.`);
    }
});
// Command untuk menguji fitur pengingat secara acak
bot.command('testreminder', (ctx) => {
    const testMessages = [
        'Ayo Sholat Subuh',
        'Persiapan Sholat Dzuhur',
        'Persiapan Sholat Ashar',
        'Mandi dan Persiapan Magrib',
        'Persiapan Sholat Isya'
    ];
    const randomMessage = testMessages[Math.floor(Math.random() * testMessages.length)];
    sendReminder(ctx, ctx.chat.id, randomMessage);
    ctx.reply(`Pengingat tes dimulai: ${randomMessage}`);
});

console.log("BOT RUNNING!")
bot.launch();

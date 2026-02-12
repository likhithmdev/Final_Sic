const axios = require('axios');

class TelegramBotService {
  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID;
    this.enabled = !!(this.botToken && this.chatId);
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
    
    if (!this.enabled) {
      console.warn('⚠️  Telegram bot not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env');
    } else {
      console.log('✓ Telegram bot service initialized');
      this.verifyBot();
    }
  }
  
  async verifyBot() {
    try {
      const response = await axios.get(`${this.baseUrl}/getMe`);
      if (response.data.ok) {
        console.log(`✓ Telegram bot connected: @${response.data.result.username}`);
      }
    } catch (error) {
      console.error('❌ Failed to verify Telegram bot:', error.message);
      this.enabled = false;
    }
  }
  
  async sendMessage(text, options = {}) {
    if (!this.enabled) {
      console.log('Telegram disabled, skipping message:', text);
      return null;
    }
    
    try {
      const response = await axios.post(`${this.baseUrl}/sendMessage`, {
        chat_id: this.chatId,
        text: text,
        parse_mode: options.parseMode || 'HTML',
        disable_notification: options.silent || false,
        ...options
      });
      
      return response.data;
    } catch (error) {
      console.error('Error sending Telegram message:', error.message);
      return null;
    }
  }
  
  async sendPhoto(photoUrl, caption = '') {
    if (!this.enabled) {
      console.log('Telegram disabled, skipping photo');
      return null;
    }
    
    try {
      const response = await axios.post(`${this.baseUrl}/sendPhoto`, {
        chat_id: this.chatId,
        photo: photoUrl,
        caption: caption,
        parse_mode: 'HTML'
      });
      
      return response.data;
    } catch (error) {
      console.error('Error sending Telegram photo:', error.message);
      return null;
    }
  }
  
  // Alert types
  async sendDetectionAlert(data) {
    const emoji = this.getWasteEmoji(data.destination);
    const message = `
🤖 <b>Smart AI Bin - Detection</b>

${emoji} <b>Waste Type:</b> ${data.destination || 'Unknown'}
📊 <b>Count:</b> ${data.count || 1} item(s)
⏰ <b>Time:</b> ${new Date().toLocaleString()}
🎯 <b>Confidence:</b> ${data.confidence ? (data.confidence * 100).toFixed(1) + '%' : 'N/A'}

${data.objects && data.objects.length > 0 ? 
  `📝 <b>Detected Objects:</b>\n${data.objects.map(obj => `  • ${obj.class} (${(obj.confidence * 100).toFixed(1)}%)`).join('\n')}` 
  : ''}
    `.trim();
    
    return await this.sendMessage(message);
  }
  
  async sendBinFullAlert(binType, fillLevel) {
    const emoji = this.getWasteEmoji(binType);
    const message = `
⚠️ <b>BIN FULL ALERT</b>

${emoji} <b>Bin Type:</b> ${binType}
📊 <b>Fill Level:</b> ${fillLevel.toFixed(0)}%
⏰ <b>Time:</b> ${new Date().toLocaleString()}

🚨 <b>Action Required:</b> Please empty the ${binType} waste bin immediately!
    `.trim();
    
    return await this.sendMessage(message);
  }
  
  async sendSystemAlert(status, message) {
    const statusEmoji = {
      'ready': '✅',
      'error': '❌',
      'warning': '⚠️',
      'shutdown': '🔴',
      'alert': '🚨'
    };
    
    const text = `
${statusEmoji[status] || '📢'} <b>System Status Update</b>

<b>Status:</b> ${status.toUpperCase()}
<b>Message:</b> ${message}
⏰ <b>Time:</b> ${new Date().toLocaleString()}
    `.trim();
    
    return await this.sendMessage(text);
  }
  
  async sendDailySummary(stats) {
    const message = `
📊 <b>Daily Summary Report</b>

🗓️ <b>Date:</b> ${new Date().toLocaleDateString()}

<b>Total Detections:</b> ${stats.total || 0}
🗑️ Dry Waste: ${stats.dry || 0}
🥬 Wet Waste: ${stats.wet || 0}
⚡ Electronic: ${stats.electronic || 0}

<b>Bin Status:</b>
🗑️ Dry: ${stats.binLevels?.dry?.toFixed(0) || 0}%
🥬 Wet: ${stats.binLevels?.wet?.toFixed(0) || 0}%
⚡ Electronic: ${stats.binLevels?.electronic?.toFixed(0) || 0}%

Keep up the great recycling! 🌍♻️
    `.trim();
    
    return await this.sendMessage(message);
  }
  
  async sendStartupNotification() {
    const message = `
🚀 <b>Smart AI Bin System Started</b>

✅ System is now online and monitoring
⏰ ${new Date().toLocaleString()}

All systems operational. Ready to detect waste! 🤖
    `.trim();
    
    return await this.sendMessage(message);
  }
  
  getWasteEmoji(type) {
    const emojis = {
      'dry': '🗑️',
      'wet': '🥬',
      'electronic': '⚡',
      'none': '❓'
    };
    return emojis[type] || '♻️';
  }
  
  // Custom message
  async sendCustomAlert(title, body, emoji = '📢') {
    const message = `
${emoji} <b>${title}</b>

${body}
⏰ ${new Date().toLocaleString()}
    `.trim();
    
    return await this.sendMessage(message);
  }
}

module.exports = new TelegramBotService();

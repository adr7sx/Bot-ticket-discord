const Discord = require("discord.js");
const { MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
  name: "ticket",
  author: "adryanj",

  run: async (client, message, args) => {
    if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply(`Apenas membros com a permissão de \`ADMINISTRADOR\`, poderão utilizar este comando.`);

    message.delete();

    let embed = new Discord.MessageEmbed()
      .setColor("BLACK")
      .setTitle("Abra um Ticket de Suporte")
      .setDescription("Clique no botão abaixo para abrir um ticket de suporte. Nossa equipe está pronta para ajudar você!")
      .setImage('https://i.imgur.com/jE1qcdY.png')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }));

    const openTicketButton = new MessageButton()
      .setCustomId('open_ticket')
      .setLabel('📩 Abrir Ticket')
      .setStyle('SUCCESS');

    const row = new MessageActionRow().addComponents(openTicketButton);

    message.channel.send({ embeds: [embed], components: [row] }).then((msg) => {
      const filtro = (interaction) => interaction.isButton();

      const coletor = msg.createMessageComponentCollector({
        filtro,
      });

      coletor.on('collect', async (collected) => {
        if (collected.customId === 'open_ticket') {
          // Obtenha o nome de usuário do autor
          const authorUsername = collected.user.username;

          // Encontre a categoria desejada pelo ID
          const desiredCategory = message.guild.channels.cache.get('1166775346541105224'); // Substitua 'ID_DA_CATEGORIA' pelo ID da categoria desejada

          if (desiredCategory && desiredCategory.type === 'GUILD_CATEGORY') {
            // O código para abrir o ticket pode ser adicionado aqui
            let embed_ticket = new Discord.MessageEmbed()
              .setColor("RANDOM")
              .setDescription(`**📩 Olá ${collected.user}, seu ticket foi criado. Para fechar o ticket digite \`t!fechar\`. **`);

            const ticketChannel = await message.guild.channels.create(authorUsername, {
              type: 'GUILD_TEXT',
              parent: desiredCategory,
              permissionOverwrites: [
                {
                  id: message.guild.id,
                  deny: ['VIEW_CHANNEL'],
                },
                {
                  id: collected.user.id,
                  allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES'],
                },
              ],
            });

            // Enviando a mensagem do bot logo abaixo do botão
            ticketChannel.send({ embeds: [embed_ticket] }).then((msg) => msg.pin());
          } else {
            console.log("Categoria não encontrada ou inválida.");
          }
        }

        collected.deferUpdate();
        
      });
    });
  },
};

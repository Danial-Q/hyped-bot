module.exports = (client, message) => {
	const {prefix, roleIDs} = client.config;
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName);

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	if (!command) return;

	if (command.adminOnly && !message.member.roles.cache.has(roleIDs.officers)) return;

	try {
		command.execute(message, args);
	} catch (err) {
		console.log(err);
		message.reply(' there was an error trying to execute that command!');
	}
};

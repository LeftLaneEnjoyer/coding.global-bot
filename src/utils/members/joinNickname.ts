import type { GuildMember, PartialGuildMember, VoiceState } from 'discord.js';
import { prisma } from '../../prisma.js';
import { updateUserVoiceState } from '../voice/updateUserVoiceState.js';

export const joinSettings = async (
  member: GuildMember | PartialGuildMember,
  voiceState?: VoiceState
) => {
  // dont add bots to the list
  if (member && member?.user?.bot) return;

  const guildMember = await prisma.memberGuild.findFirst({
    where: {
      guildId: voiceState?.guild.id || member?.guild.id,
      memberId: member?.id || voiceState?.member?.id,
    },
  });

  if (guildMember && member) {
    member = await member.fetch();

    if (guildMember.nickname && guildMember.nickname !== member.nickname) {
      await member.setNickname(guildMember.nickname);
    }
    console.log(
      'guildMember.muted',
      guildMember.muted,
      'member.voice.serverMute',
      member.voice.serverMute
    );
    if (voiceState?.channelId) {
      if (member.voice.serverMute !== guildMember.muted) {
        // await updateUserVoiceState(voiceState);
        await member.voice.setMute(guildMember.muted);
      }

      if (member.voice.serverDeaf !== guildMember.deafened) {
        // await updateUserVoiceState(voiceState);
        await member.voice.setDeaf(guildMember.deafened);
      }
    }
  }
};

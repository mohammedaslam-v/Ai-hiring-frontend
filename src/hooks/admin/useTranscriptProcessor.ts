import { useMemo } from 'react';
import { TranscriptMessage } from '@/types/admin';

export const useTranscriptProcessor = (evaluation: Record<string, unknown> | null) => {
  const transcriptData: TranscriptMessage[] = useMemo(() => {
    if (!evaluation) return [];
    
    const transcript = evaluation?.transcript;
    const rawSessionData = evaluation?.raw_session_data;
    let messages: TranscriptMessage[] | undefined;
    
    if (rawSessionData && typeof rawSessionData === 'object') {
      const sessionData = rawSessionData as Record<string, unknown>;
      messages = Array.isArray(sessionData.messages) ? sessionData.messages as TranscriptMessage[] : undefined;
    }
    
    return (transcript || messages || []) as TranscriptMessage[];
  }, [evaluation]);

  const hasTranscript = Array.isArray(transcriptData) && transcriptData.length > 0;

  const formatTranscriptMessage = (msg: TranscriptMessage, idx: number) => {
    const role = (msg && (msg.role || msg.speaker || msg.sender)) || 'Message';
    const text = (msg && (msg.text || msg.content || msg.message)) || (typeof msg === 'string' ? msg : JSON.stringify(msg));
    const time = msg && (msg.timestamp || msg.time);
    
    return {
      id: idx,
      role: String(role),
      text: String(text),
      time: time ? String(time) : undefined
    };
  };

  return {
    transcriptData,
    hasTranscript,
    formatTranscriptMessage
  };
};

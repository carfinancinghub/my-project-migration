/**
 * © 2025 CFH, All Rights Reserved
 * File: VoiceBidAssistant.test.ts
 * Path: backend/tests/ai/VoiceBidAssistant.test.ts
 * Purpose: Unit tests for VoiceBidAssistant AI service
 * Author: Cod1 Team
 * Date: 2025-07-19 [0015]
 * Version: 1.0.1
 * Version ID: x1c2v3b4n5m6l7k8j9h0g1f2d3s4a5p6
 * Crown Certified: Yes
 * Batch ID: Compliance-071925
 * Artifact ID: x1c2v3b4n5m6l7k8j9h0g1f2d3s4a5p6
 * Save Location: backend/tests/ai/VoiceBidAssistant.test.ts
 */
/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Converted to TypeScript with typed mocks and AI interactions
 * - Added tests for speech-to-text, voice bid commands, invalid inputs
 * - Suggest extracting mock audio data to test utils for DRY
 * - Suggest E2E test with real voice service
 * - Improved: Typed voiceResult, error path coverage
 * - Free: Basic voice bid command test
 * - Premium: Voice command history, feedback learning
 * - Wow++: Real-time speech analytics, sentiment detection
 */

import VoiceBidAssistant from '@services/ai/VoiceBidAssistant';
import * as ai from '@services/ai';
import * as logger from '@utils/logger';

jest.mock('@services/ai');
jest.mock('@utils/logger');

describe('VoiceBidAssistant', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('processVoiceCommand', () => {
    it('processes valid voice bid command', async () => {
      const mockAudioData = Buffer.from('FAKEAUDIO');
      const mockResult = { command: 'bid', value: 12000, confidence: 0.98 };

      (ai.transcribeVoice as jest.Mock).mockResolvedValueOnce('Bid twelve thousand dollars');
      (ai.interpretCommand as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await VoiceBidAssistant.processVoiceCommand(mockAudioData);
      expect(result).toEqual(mockResult);
      expect(ai.transcribeVoice).toHaveBeenCalledWith(mockAudioData);
      expect(ai.interpretCommand).toHaveBeenCalledWith('Bid twelve thousand dollars');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Voice bid processed'));
    });

    it('returns error for unclear voice command', async () => {
      const mockAudioData = Buffer.from('NOISE');
      (ai.transcribeVoice as jest.Mock).mockResolvedValueOnce('');
      (ai.interpretCommand as jest.Mock).mockResolvedValueOnce(null);

      await expect(VoiceBidAssistant.processVoiceCommand(mockAudioData)).rejects.toThrow('Unrecognized voice command');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Unrecognized voice command'));
    });

    it('handles AI transcription errors', async () => {
      const mockAudioData = Buffer.from('CORRUPT');
      (ai.transcribeVoice as jest.Mock).mockRejectedValueOnce(new Error('Transcription failed'));

      await expect(VoiceBidAssistant.processVoiceCommand(mockAudioData)).rejects.toThrow('Transcription failed');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Transcription failed'));
    });
  });

  describe('getVoiceCommandHistory', () => {
    it('retrieves voice command history for user', async () => {
      const userId = 'user789';
      const mockHistory = [
        { command: 'bid', value: 12000, timestamp: '2025-07-19T01:01:01Z' },
        { command: 'increase', value: 500, timestamp: '2025-07-19T01:02:01Z' }
      ];

      (ai.getVoiceCommandHistory as jest.Mock).mockResolvedValueOnce(mockHistory);

      const result = await VoiceBidAssistant.getVoiceCommandHistory(userId);
      expect(result).toEqual(mockHistory);
      expect(ai.getVoiceCommandHistory).toHaveBeenCalledWith(userId);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Voice command history retrieved'));
    });

    it('handles errors when retrieving history', async () => {
      const userId = 'user789';
      (ai.getVoiceCommandHistory as jest.Mock).mockRejectedValueOnce(new Error('History fetch failed'));

      await expect(VoiceBidAssistant.getVoiceCommandHistory(userId)).rejects.toThrow('History fetch failed');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('History fetch failed'));
    });
  });
});

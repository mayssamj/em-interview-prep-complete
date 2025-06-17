
/**
 * Tests for the type conversion fix that resolves JsonValue to string[] conversion issues
 * This test ensures the application properly handles Prisma JsonValue types
 */

import { safeJsonToStringArray, jsonToStringArray, ensureStringArray } from '@/lib/type-utils';

describe('Type Conversion Fix Tests', () => {
  describe('safeJsonToStringArray', () => {
    test('should convert valid JSON array to string array', () => {
      const input = ['test1', 'test2', 'test3'];
      const result = safeJsonToStringArray(input);
      expect(result).toEqual(['test1', 'test2', 'test3']);
    });

    test('should handle JSON string array', () => {
      const input = '["test1", "test2", "test3"]';
      const result = safeJsonToStringArray(input);
      expect(result).toEqual(['test1', 'test2', 'test3']);
    });

    test('should handle mixed type arrays by converting to strings', () => {
      const input = ['test1', 123, true, 'test2'];
      const result = safeJsonToStringArray(input);
      expect(result).toEqual(['test1', '123', 'true', 'test2']);
    });

    test('should handle null and undefined', () => {
      expect(safeJsonToStringArray(null)).toEqual([]);
      expect(safeJsonToStringArray(undefined)).toEqual([]);
    });

    test('should handle invalid JSON gracefully', () => {
      const input = 'invalid json string';
      const result = safeJsonToStringArray(input);
      expect(result).toEqual(['invalid json string']);
    });

    test('should handle empty arrays', () => {
      expect(safeJsonToStringArray([])).toEqual([]);
      expect(safeJsonToStringArray('[]')).toEqual([]);
    });
  });

  describe('jsonToStringArray', () => {
    test('should filter non-string values from arrays', () => {
      const input = ['test1', 123, 'test2', null, 'test3'];
      const result = jsonToStringArray(input);
      expect(result).toEqual(['test1', 'test2', 'test3']);
    });

    test('should parse JSON string and filter', () => {
      const input = '["test1", 123, "test2"]';
      const result = jsonToStringArray(input);
      expect(result).toEqual(['test1', 'test2']);
    });
  });

  describe('ensureStringArray', () => {
    test('should convert all values to strings', () => {
      const input = ['test1', 123, true, null];
      const result = ensureStringArray(input);
      expect(result).toEqual(['test1', '123', 'true', 'null']);
    });

    test('should handle single string value', () => {
      const input = 'single string';
      const result = ensureStringArray(input);
      expect(result).toEqual(['single string']);
    });
  });

  describe('Real-world Prisma JsonValue scenarios', () => {
    test('should handle company values from database', () => {
      // Simulate what Prisma returns for JsonValue fields
      const mockCompanyData = {
        values: ['Innovation', 'Customer Focus', 'Excellence'],
        evaluation_criteria: '["Leadership", "Technical Skills", "Communication"]',
        success_tips: null,
        red_flags: undefined
      };

      expect(safeJsonToStringArray(mockCompanyData.values)).toEqual([
        'Innovation', 'Customer Focus', 'Excellence'
      ]);
      expect(safeJsonToStringArray(mockCompanyData.evaluation_criteria)).toEqual([
        'Leadership', 'Technical Skills', 'Communication'
      ]);
      expect(safeJsonToStringArray(mockCompanyData.success_tips)).toEqual([]);
      expect(safeJsonToStringArray(mockCompanyData.red_flags)).toEqual([]);
    });

    test('should handle question tags from database', () => {
      const mockQuestionData = {
        tags: ['behavioral', 'leadership', 'conflict-resolution'],
        categories: '["management", "team-building"]'
      };

      expect(safeJsonToStringArray(mockQuestionData.tags)).toEqual([
        'behavioral', 'leadership', 'conflict-resolution'
      ]);
      expect(safeJsonToStringArray(mockQuestionData.categories)).toEqual([
        'management', 'team-building'
      ]);
    });

    test('should handle story metadata from database', () => {
      const mockStoryData = {
        tags: ['leadership', 'crisis-management'],
        categories: '["behavioral", "situational"]'
      };

      expect(safeJsonToStringArray(mockStoryData.tags)).toEqual([
        'leadership', 'crisis-management'
      ]);
      expect(safeJsonToStringArray(mockStoryData.categories)).toEqual([
        'behavioral', 'situational'
      ]);
    });
  });
});

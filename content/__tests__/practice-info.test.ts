import { describe, expect, test } from 'vitest';
import { practiceInfo } from '../practice-info';

describe('practice info', () => {
  test('address is the corrected Suite 120, ZIP 91701', () => {
    expect(practiceInfo.address.street).toBe('11458 Kenyon Way, Suite 120');
    expect(practiceInfo.address.zip).toBe('91701');
  });

  test('exactly one phone (the flyer number)', () => {
    expect(practiceInfo.phones).toHaveLength(1);
    expect(practiceInfo.phones[0]?.number).toBe('(909) 941-2811');
    expect(practiceInfo.phones[0]?.tel).toBe('+19099412811');
  });

  test('email is surfaced (not null)', () => {
    expect(practiceInfo.email).toBe('advancedcare@dentisthsu.com');
  });

  test('hours: Mon/Tues/Thurs 9-6, Wed 8-5, Fri/Sat/Sun closed', () => {
    const byDay = Object.fromEntries(practiceInfo.hours.map((h) => [h.day, h]));
    expect(byDay['Monday']).toEqual({ day: 'Monday', open: '09:00', close: '18:00' });
    expect(byDay['Tuesday']).toEqual({ day: 'Tuesday', open: '09:00', close: '18:00' });
    expect(byDay['Wednesday']).toEqual({ day: 'Wednesday', open: '08:00', close: '17:00' });
    expect(byDay['Thursday']).toEqual({ day: 'Thursday', open: '09:00', close: '18:00' });
    expect(byDay['Friday']?.closed).toBe(true);
    expect(byDay['Saturday']?.closed).toBe(true);
    expect(byDay['Sunday']?.closed).toBe(true);
  });
});

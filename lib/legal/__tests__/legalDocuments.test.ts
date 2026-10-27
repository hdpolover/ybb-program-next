// lib/legal/__tests__/legalDocuments.test.ts
import { describe, expect, it } from 'vitest';
import { getCandidateSlugs, matchBrand, pickDocumentFromList, type LegalDocument } from '../legalDocuments';

const doc = (slug: string, title: string): LegalDocument => ({ id: slug, slug, title, content: 'x', version: '1' });

describe('legalDocuments', () => {
  it('tries the canonical slugs first per type', () => {
    expect(getCandidateSlugs('terms')[0]).toBe('terms-of-service');
    expect(getCandidateSlugs('privacy')[0]).toBe('privacy-policy');
  });

  it('picks a document by slug or title keyword', () => {
    const docs = [doc('refund', 'Refunds'), doc('x', 'Terms and Conditions'), doc('privacy-notice', 'Notice')];
    expect(pickDocumentFromList('terms', docs)?.slug).toBe('x');
    expect(pickDocumentFromList('privacy', docs)?.slug).toBe('privacy-notice');
    expect(pickDocumentFromList('terms', [doc('a', 'About')])).toBeNull();
  });

  it('matches a brand by domain, ignoring www', () => {
    const brands = [{ id: '1', slug: 'meys', websiteUrl: 'https://meys.example.org' }];
    expect(matchBrand(brands, 'www.meys.example.org')?.slug).toBe('meys');
    expect(matchBrand(brands, 'other.org')).toBeNull();
  });
});

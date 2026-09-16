"use client";

import type { ComponentType } from "react";
import * as CryptoTools from "./crypto";
import * as EncodingTools from "./encoding";
import * as SecurityTools from "./security";
import * as NetworkTools from "./network";
import * as AdTools from "./ad";
import * as ServerTools from "./server";
import * as PkiTools from "./pki";
import * as TextTools from "./text";
import * as TimeTools from "./time";
import * as DocsTools from "./docs";
import * as FakeDataTools from "./fakeData";

// Ordnet jeden Tool-Slug der passenden UI-Komponente zu
const COMPONENTS: Record<string, ComponentType> = {
  "hash-generator": CryptoTools.HashGenerator,
  "hash-identifier": CryptoTools.HashIdentifier,
  "hmac-generator": CryptoTools.HmacGenerator,
  "caesar-cipher": CryptoTools.CaesarCipher,
  "rot13": CryptoTools.Rot13Tool,
  "vigenere-cipher": CryptoTools.VigenereCipher,
  "aes-encryption": CryptoTools.AesEncryption,

  "base64": EncodingTools.Base64Tool,
  "url-encoding": EncodingTools.UrlEncodingTool,
  "html-entities": EncodingTools.HtmlEntitiesTool,
  "binary-text": EncodingTools.BinaryTextTool,
  "hex-text": EncodingTools.HexTextTool,
  "morse-code": EncodingTools.MorseCodeTool,
  "number-base-converter": EncodingTools.NumberBaseConverter,
  "ascii-table": EncodingTools.AsciiTable,

  "password-generator": SecurityTools.PasswordGenerator,
  "password-strength": SecurityTools.PasswordStrengthChecker,
  "hibp-checker": SecurityTools.HibpChecker,
  "password-policy-checker": SecurityTools.PasswordPolicyChecker,

  "subnet-calculator": NetworkTools.SubnetCalculator,
  "ip-range-generator": NetworkTools.IpRangeGenerator,
  "mac-lookup": NetworkTools.MacLookup,
  "bandwidth-calculator": NetworkTools.BandwidthCalculator,
  "ports-reference": NetworkTools.PortsReference,
  "unix-timestamp": NetworkTools.UnixTimestampConverter,
  "dns-lookup": NetworkTools.DnsLookup,

  "username-generator": AdTools.UsernameGenerator,
  "sid-guid-decoder": AdTools.SidGuidDecoder,

  "cron-explainer": ServerTools.CronExplainer,
  "cron-generator": ServerTools.CronGenerator,
  "uptime-calculator": ServerTools.UptimeCalculator,
  "log-filter": ServerTools.LogFilterTool,

  "ssl-cert-decoder": PkiTools.SslCertDecoder,
  "cert-expiry-calculator": PkiTools.CertExpiryCalculator,
  "csr-guide": PkiTools.CsrGuide,

  "json-formatter": TextTools.JsonFormatter,
  "xml-formatter": TextTools.XmlFormatter,
  "yaml-formatter": TextTools.YamlFormatter,
  "regex-tester": TextTools.RegexTester,
  "text-diff": TextTools.TextDiffChecker,

  "sla-calculator": TimeTools.SlaCalculator,
  "maintenance-window-planner": TimeTools.MaintenanceWindowPlanner,
  "timezone-comparison": TimeTools.TimezoneComparison,
  "storage-unit-converter": TimeTools.StorageUnitConverter,

  "it-ticket-template": DocsTools.ItTicketTemplate,
  "onboarding-checklist": DocsTools.OnboardingChecklist,
  "password-handover-template": DocsTools.PasswordHandoverTemplate,
  "snippet-collection": DocsTools.SnippetCollection,

  "fake-data-generator": FakeDataTools.FakeDataGenerator,
};

export function ToolRouter({ slug }: { slug: string }) {
  const Component = COMPONENTS[slug];
  if (!Component) return <p className="muted">Dieses Tool ist noch nicht verfügbar.</p>;
  return <Component />;
}

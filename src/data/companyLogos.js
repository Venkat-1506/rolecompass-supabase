/**
 * RoleCompass Centralized Company Logo Asset Registry
 * Authoritative mapping of canonical company IDs to Vite-bundled SVG assets.
 * Assets reside in: src/assets/company-logos/ and public/assets/company-logos/
 */

// 46 Logos from original companies collection
import accentureLogo from '../assets/company-logos/accenture.svg';
import adobeLogo from '../assets/company-logos/adobe.svg';
import airbnbLogo from '../assets/company-logos/airbnb.svg';
import airindiaLogo from '../assets/company-logos/airindia.svg';
import airtelLogo from '../assets/company-logos/airtel.svg';
import amazonLogo from '../assets/company-logos/amazon.svg';
import atlassianLogo from '../assets/company-logos/atlassian.svg';
import axisbankLogo from '../assets/company-logos/axisbank.svg';
import bmwLogo from '../assets/company-logos/bmw.svg';
import ciscoLogo from '../assets/company-logos/cisco.svg';
import cocacolaLogo from '../assets/company-logos/cocacola.svg';
import credLogo from '../assets/company-logos/cred.svg';
import deloitteLogo from '../assets/company-logos/deloitte.svg';
import flipkartLogo from '../assets/company-logos/flipkart.svg';
import freshworksLogo from '../assets/company-logos/freshworks.svg';
import githubLogo from '../assets/company-logos/github.svg';
import goldmansachsLogo from '../assets/company-logos/goldmansachs.svg';
import googleLogo from '../assets/company-logos/google.svg';
import hdfcLogo from '../assets/company-logos/hdfc.svg';
import hdfcbankLogo from '../assets/company-logos/hdfcbank.svg';
import ibmLogo from '../assets/company-logos/ibm.svg';
import icicibankLogo from '../assets/company-logos/icicibank.svg';
import infosysLogo from '../assets/company-logos/infosys.svg';
import jioLogo from '../assets/company-logos/jio.svg';
import linkedinLogo from '../assets/company-logos/linkedin.svg';
import mahindraLogo from '../assets/company-logos/mahindra.svg';
import microsoftLogo from '../assets/company-logos/microsoft.svg';
import netflixLogo from '../assets/company-logos/netflix.svg';
import nvidiaLogo from '../assets/company-logos/nvidia.svg';
import oracleLogo from '../assets/company-logos/oracle.svg';
import paypalLogo from '../assets/company-logos/paypal.svg';
import paytmLogo from '../assets/company-logos/paytm.svg';
import phonepeLogo from '../assets/company-logos/phonepe.svg';
import razorpayLogo from '../assets/company-logos/razorpay.svg';
import samsungLogo from '../assets/company-logos/samsung.svg';
import spotifyLogo from '../assets/company-logos/spotify.svg';
import stripeLogo from '../assets/company-logos/stripe.svg';
import swiggyLogo from '../assets/company-logos/swiggy.svg';
import tataLogo from '../assets/company-logos/tata.svg';
import tatadigitalLogo from '../assets/company-logos/tatadigital.svg';
import tcsLogo from '../assets/company-logos/tcs.svg';
import toyotaLogo from '../assets/company-logos/toyota.svg';
import uberLogo from '../assets/company-logos/uber.svg';
import wiproLogo from '../assets/company-logos/wipro.svg';
import zohoLogo from '../assets/company-logos/zoho.svg';
import zomatoLogo from '../assets/company-logos/zomato.svg';

// 32 Logos from companies2 collection
import adidasLogo from '../assets/company-logos/adidas.svg';
import androidLogo from '../assets/company-logos/android-icon.svg';
import appleLogo from '../assets/company-logos/apple.svg';
import audiLogo from '../assets/company-logos/audi.svg';
import awsLogo from '../assets/company-logos/aws.svg';
import boatLogo from '../assets/company-logos/boat.svg';
import bookmyshowLogo from '../assets/company-logos/bookmyshow.svg';
import chessdotcomLogo from '../assets/company-logos/chessdotcom.svg';
import claudeLogo from '../assets/company-logos/claude.svg';
import eaLogo from '../assets/company-logos/ea.svg';
import facebookLogo from '../assets/company-logos/facebook.svg';
import fortniteLogo from '../assets/company-logos/fortnite.svg';
import gameloftLogo from '../assets/company-logos/gameloft.svg';
import deepmindLogo from '../assets/company-logos/google-gemini-icon.svg';
import handmLogo from '../assets/company-logos/handm.svg';
import hondaLogo from '../assets/company-logos/honda.svg';
import mastercardLogo from '../assets/company-logos/mastercard.svg';
import mcdonaldsLogo from '../assets/company-logos/mcdonalds.svg';
import nikeLogo from '../assets/company-logos/nike.svg';
import openaiLogo from '../assets/company-logos/openai-icon.svg';
import playstationLogo from '../assets/company-logos/playstation.svg';
import riotgamesLogo from '../assets/company-logos/riotgames.svg';
import robloxLogo from '../assets/company-logos/roblox.svg';
import rockstargamesLogo from '../assets/company-logos/rockstargames.svg';
import starbucksLogo from '../assets/company-logos/starbucks.svg';
import steamLogo from '../assets/company-logos/steam.svg';
import suzukiLogo from '../assets/company-logos/suzuki.svg';
import teslaLogo from '../assets/company-logos/tesla.svg';
import twitchLogo from '../assets/company-logos/twitch.svg';
import whatsappLogo from '../assets/company-logos/whatsapp.svg';
import xLogo from '../assets/company-logos/x.svg';
import youtubeLogo from '../assets/company-logos/youtube.svg';

/**
 * Primary Company Logo Map keyed by canonical company ID.
 * Aliases are provided to prevent broken references under alternative names.
 */
export const companyLogos = {
  // Existing 44 companies (plus variants)
  accenture: accentureLogo,
  adobe: adobeLogo,
  airbnb: airbnbLogo,
  airindia: airindiaLogo,
  airtel: airtelLogo,
  airteldigital: airtelLogo,
  amazon: amazonLogo,
  atlassian: atlassianLogo,
  axisbank: axisbankLogo,
  bmw: bmwLogo,
  cisco: ciscoLogo,
  cocacola: cocacolaLogo,
  cred: credLogo,
  deloitte: deloitteLogo,
  flipkart: flipkartLogo,
  freshworks: freshworksLogo,
  github: githubLogo,
  goldmansachs: goldmansachsLogo,
  google: googleLogo,
  hdfc: hdfcLogo,
  hdfcbank: hdfcbankLogo,
  ibm: ibmLogo,
  icicibank: icicibankLogo,
  infosys: infosysLogo,
  jio: jioLogo,
  linkedin: linkedinLogo,
  mahindra: mahindraLogo,
  microsoft: microsoftLogo,
  netflix: netflixLogo,
  nvidia: nvidiaLogo,
  oracle: oracleLogo,
  paypal: paypalLogo,
  paytm: paytmLogo,
  phonepe: phonepeLogo,
  razorpay: razorpayLogo,
  samsung: samsungLogo,
  spotify: spotifyLogo,
  stripe: stripeLogo,
  swiggy: swiggyLogo,
  tata: tataLogo,
  tatadigital: tatadigitalLogo,
  tcs: tcsLogo,
  toyota: toyotaLogo,
  uber: uberLogo,
  wipro: wiproLogo,
  zoho: zohoLogo,
  zomato: zomatoLogo,

  // 32 New companies from companies2
  adidas: adidasLogo,
  android: androidLogo,
  'android-icon': androidLogo,
  apple: appleLogo,
  audi: audiLogo,
  aws: awsLogo,
  boat: boatLogo,
  bookmyshow: bookmyshowLogo,
  chessdotcom: chessdotcomLogo,
  anthropic: claudeLogo,
  claude: claudeLogo,
  ea: eaLogo,
  electronicarts: eaLogo,
  meta: facebookLogo,
  facebook: facebookLogo,
  epicgames: fortniteLogo,
  fortnite: fortniteLogo,
  gameloft: gameloftLogo,
  deepmind: deepmindLogo,
  'google-gemini': deepmindLogo,
  gemini: deepmindLogo,
  handm: handmLogo,
  hm: handmLogo,
  honda: hondaLogo,
  mastercard: mastercardLogo,
  mcdonalds: mcdonaldsLogo,
  nike: nikeLogo,
  openai: openaiLogo,
  'openai-icon': openaiLogo,
  playstation: playstationLogo,
  sony: playstationLogo,
  riotgames: riotgamesLogo,
  roblox: robloxLogo,
  rockstargames: rockstargamesLogo,
  starbucks: starbucksLogo,
  valve: steamLogo,
  steam: steamLogo,
  suzuki: suzukiLogo,
  marutisuzuki: suzukiLogo,
  tesla: teslaLogo,
  twitch: twitchLogo,
  whatsapp: whatsappLogo,
  x: xLogo,
  twitter: xLogo,
  youtube: youtubeLogo
};

/**
 * Helper to retrieve a company's logo URL safely.
 * Returns null if not found (allowing caller to trigger initials fallback).
 */
export function getCompanyLogo(companyId) {
  if (!companyId) return null;
  const key = String(companyId).toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
  return companyLogos[key] || null;
}

export default companyLogos;

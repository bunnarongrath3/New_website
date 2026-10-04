/**
 * EMVCo-compliant KHQR Generator for Cambodia Bakong & ABA PayWay
 */

export function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function formatTlv(tag: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${tag}${len}${value}`;
}

export interface KhqrParams {
  bakongAccountId: string;
  merchantName: string;
  merchantCity?: string;
  amount: number;
  currency: 'USD' | 'KHR';
  orderId: string;
  acquiringBank?: string;
}

export function generateKhqrString(params: KhqrParams): string {
  const {
    bakongAccountId,
    merchantName,
    merchantCity = 'Phnom Penh',
    amount,
    currency,
    orderId,
    acquiringBank = 'abaakhpp'
  } = params;

  // Merchant info sub-TLVs (Tag 29)
  const tag00 = formatTlv('00', bakongAccountId);
  const tag01 = formatTlv('01', acquiringBank);
  const merchantInfoValue = `${tag00}${tag01}`;
  const tag29 = formatTlv('29', merchantInfoValue);

  // Additional Data sub-TLVs (Tag 62)
  const billNumber = formatTlv('01', orderId.slice(0, 25));
  const storeLabel = formatTlv('03', 'AuraTopUp');
  const additionalData = formatTlv('62', `${billNumber}${storeLabel}`);

  const formattedAmount = currency === 'KHR' 
    ? Math.round(amount).toString()
    : amount.toFixed(2);

  const currencyCode = currency === 'USD' ? '840' : '116';

  let rawKhqr = 
    formatTlv('00', '01') + // Format indicator
    formatTlv('01', '12') + // Dynamic QR
    tag29 +                 // Bakong merchant info
    formatTlv('52', '5999') + // Merchant category
    formatTlv('53', currencyCode) +
    formatTlv('54', formattedAmount) +
    formatTlv('58', 'KH') +
    formatTlv('59', merchantName.slice(0, 25)) +
    formatTlv('60', merchantCity.slice(0, 15)) +
    additionalData +
    '6304'; // CRC Tag with 4-char length placeholder

  const checksum = crc16(rawKhqr);
  return `${rawKhqr}${checksum}`;
}

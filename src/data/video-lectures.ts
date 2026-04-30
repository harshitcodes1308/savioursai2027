/**
 * Video Lectures — ICSE Class 10
 * Subject-wise, chapter-wise YouTube lecture links.
 * English Literature is marked comingSoon — no links available yet.
 */

export interface VideoChapter {
  title: string;
  videoId: string;
}

export interface SubjectVideos {
  subject: string;
  icon: string;
  color: string;
  comingSoon?: boolean;
  chapters: VideoChapter[];
}

/** Extract video ID from any YouTube URL format */
export function extractVideoId(url: string): string {
  const m =
    url.match(/youtu\.be\/([A-Za-z0-9_-]+)/) ||
    url.match(/youtube\.com\/live\/([A-Za-z0-9_-]+)/) ||
    url.match(/youtube\.com\/watch\?v=([A-Za-z0-9_-]+)/);
  return m ? m[1] : '';
}

function ch(title: string, url: string): VideoChapter {
  return { title, videoId: extractVideoId(url) };
}

export const VIDEO_LECTURES: SubjectVideos[] = [
  {
    subject: 'Mathematics',
    icon: '🔢',
    color: '#3B82F6',
    chapters: [
      ch('Goods and Services Tax (GST)',         'https://youtu.be/iWcGaP_eWeA'),
      ch('Banking',                               'https://youtu.be/gZCrI573Yy8'),
      ch('Shares and Dividends',                 'https://youtu.be/cxuL191S6VY'),
      ch('Linear Inequations',                   'https://youtu.be/gzwo0IRLkM4'),
      ch('Quadratic Equations',                  'https://youtu.be/q7TmhgBbEJ8'),
      ch('Ratio and Proportion',                 'https://youtu.be/9yFiifEYiPI'),
      ch('Remainder and Factor Theorem',         'https://youtu.be/KUmUXT0TlY8'),
      ch('Matrices',                             'https://youtu.be/JwLBFvw5owU'),
      ch('Arithmetic Progression (AP)',          'https://youtu.be/_1HxhsNvpzc'),
      ch('Geometric Progression (GP)',           'https://youtu.be/QR9B3qMXDDY'),
      ch('Reflection',                           'https://youtu.be/N51MhaYu18I'),
      ch('Section and Mid-Point Formula',        'https://youtu.be/f5IVhHnfyCk'),
      ch('Equation of a Straight Line',          'https://youtu.be/UXYgRZWDglI'),
      ch('Similarity',                           'https://youtu.be/kfxibvVquHw'),
      ch('Circles – Cyclic Properties',          'https://youtu.be/No8okxqy0vA'),
      ch('Circles – Angle Properties',           'https://youtu.be/nSuSvnCEGZg'),
      ch('Tangents and Secants',                 'https://youtu.be/6_iEGczwfO8'),
      ch('Cylinder, Cone and Sphere',            'https://youtu.be/GlcnVhwJA5Y'),
      ch('Trigonometric Identities',             'https://youtu.be/sKVWQK2Zn34'),
    ],
  },
  {
    subject: 'Physics',
    icon: '⚡',
    color: '#F59E0B',
    chapters: [
      ch('Force',                                    'https://youtu.be/ONS_qjuKrq8'),
      ch('Work, Energy and Power',                   'https://youtu.be/uhUTO6ilpZ4'),
      ch('Machines',                                 'https://youtu.be/4bghi4g6UhA'),
      ch('Refraction of Light at Plane Surfaces',    'https://youtu.be/5AVlCIOOJDs'),
      ch('Refraction through a Lens',                'https://youtu.be/-A0yLShb85k'),
      ch('Spectrum',                                 'https://youtu.be/Vk1BaG_lbj0'),
      ch('Sound',                                    'https://youtu.be/tme78Q0lTkY'),
      ch('Calorimetry',                              'https://youtu.be/ZHG30f6aH5U'),
      ch('Current Electricity',                      'https://youtu.be/mvZKUWQBuOc'),
      ch('Electrical Power and Household Circuits',  'https://youtu.be/C4ZWFlXvwnk'),
      ch('Electromagnetism',                         'https://youtu.be/277lWoUr36E'),
      ch('Radioactivity',                            'https://youtu.be/V6hYbriPhqk'),
    ],
  },
  {
    subject: 'Chemistry',
    icon: '🧪',
    color: '#00D4FF',
    chapters: [
      ch('Periodic Table',                       'https://youtu.be/IePO2EmTQkQ'),
      ch('Chemical Bonding',                     'https://youtu.be/oFPPJstX7N0'),
      ch('Acids, Bases and Salts',               'https://youtu.be/6gZsd4SG6hU'),
      ch('Analytical Chemistry',                 'https://youtu.be/GNKb__9uwcM'),
      ch('Mole Concept and Stoichiometry',       'https://youtu.be/R9I0boD4taY'),
      ch('Electrolysis',                         'https://youtu.be/17_ukKwYE9U'),
      ch('Metallurgy',                           'https://youtu.be/9DaA95KHpoA'),
      ch('Study of Compounds – HCl',             'https://www.youtube.com/live/XnnEcX8IDD0'),
      ch('Study of Compounds – Ammonia (NH₃)',   'https://youtu.be/9DAdgTkVTdg'),
      ch('Study of Compounds – Nitric Acid',     'https://youtu.be/zvirKZpDytg'),
      ch('Study of Compounds – Sulphuric Acid',  'https://www.youtube.com/live/nVdrzLLRAiY'),
      ch('Organic Chemistry',                    'https://youtu.be/_YYL7OBE11k'),
      ch('One Shot – Full Chemistry',            'https://www.youtube.com/live/WpGIp43ZW_0'),
    ],
  },
  {
    subject: 'Biology',
    icon: '🧬',
    color: '#22c55e',
    chapters: [
      ch('Cell Division and Cell Cycle',         'https://www.youtube.com/live/dLZxcbB9crs'),
      ch('Genetics',                             'https://www.youtube.com/live/BcFE9Fg7r1Y'),
      ch('Absorption by Roots',                  'https://www.youtube.com/live/sCvQZQL1fRc'),
      ch('Transpiration',                        'https://youtu.be/LFmIkLQwhGg'),
      ch('Photosynthesis',                       'https://youtu.be/5c61BkkrnEU'),
      ch('Chemical Coordination in Plants',      'https://youtu.be/XHthfFM_9Hs'),
      ch('The Circulatory System',               'https://youtu.be/bqCah5NvfTM'),
      ch('The Excretory System',                 'https://youtu.be/Wj8IfXfMUy0'),
      ch('The Endocrine System',                 'https://youtu.be/dQJg4lSbnPo'),
      ch('The Reproductive System',              'https://youtu.be/lfU-C0pDRlo'),
      ch('Population',                           'https://youtu.be/2QKio4tL1GY'),
      ch('Pollution',                            'https://youtu.be/lfU-C0pDRlo'),
    ],
  },
  {
    subject: 'History & Civics',
    icon: '🏛️',
    color: '#FB923C',
    chapters: [
      ch('The First War of Independence, 1857',                   'https://youtu.be/e8AZQ7mla84'),
      ch('Growth of Nationalism',                                  'https://youtu.be/gTjfRlcc8AQ'),
      ch('Indian National Congress – Objectives & Early Phase',   'https://youtu.be/f1-vxNd36Rg'),
      ch('Non-Cooperation Movement',                               'https://youtu.be/rHQkh80MZFk'),
      ch('Mahatma Gandhi and the National Movement',               'https://youtu.be/rHQkh80MZFk'),
      ch('Forward Bloc and INA',                                   'https://youtu.be/Drw6s-hqFgM'),
      ch('Independence and Partition of India',                    'https://youtu.be/u6sUQwQtqsg'),
      ch('The First World War',                                    'https://youtu.be/ltc4-ABipWY'),
      ch('Rise of Dictatorships',                                  'https://youtu.be/4WCRGTjCYl0'),
      ch('The Second World War',                                   'https://youtu.be/zLDgH9cU0ak'),
      ch('The Union Legislature (Parliament)',                     'https://youtu.be/Hv74pZUXxn0'),
      ch('The Union Executive – President & Vice President',      'https://youtu.be/pfTlqBJg5IM'),
      ch('The Union Executive – PM & Council of Ministers',       'https://youtu.be/CcQYZKoblsM'),
      ch('The Union Judiciary',                                    'https://youtu.be/CcQYZKoblsM'),
    ],
  },
  {
    subject: 'Geography',
    icon: '🌍',
    color: '#14B8A6',
    chapters: [
      ch('Complete Topography',  'https://www.youtube.com/live/7kfq-sOeXhc'),
      ch('Complete Geography',   'https://www.youtube.com/live/1TPMDeDABDk'),
    ],
  },
  {
    subject: 'English Language',
    icon: '📝',
    color: '#A78BFA',
    chapters: [
      ch('Essay / Composition Writing', 'https://youtu.be/JpwtM2TV7SQ'),
      ch('Notice & E-mail Writing',     'https://youtu.be/ROU9EKoCk6U'),
    ],
  },
  {
    subject: 'English Literature',
    icon: '📖',
    color: '#EC4899',
    comingSoon: true,
    chapters: [],
  },
  {
    subject: 'Computer Applications',
    icon: '💻',
    color: '#F97316',
    chapters: [
      ch('Basics of Programming',        'https://youtu.be/v_TyAaisB2Q'),
      ch('Input Mechanism',              'https://youtu.be/06LT7JYS7Bo'),
      ch('If-Else and Nested If-Else',   'https://youtu.be/M8JYBz-R19o'),
      ch('Mathematical Functions',       'https://youtu.be/DWbooACEAqM'),
      ch('Loops',                        'https://youtu.be/ZGa33g5ii3k'),
      ch('Patterns',                     'https://youtu.be/s33-gj4VHSM'),
      ch('Series',                       'https://youtu.be/vA1Vx5Qw5OE'),
      ch('Constructors',                 'https://youtu.be/5pm61kW5hYs'),
      ch('Functions',                    'https://youtu.be/DWbooACEAqM'),
      ch('String',                       'https://youtu.be/oR81oaKdrhk'),
      ch('Array',                        'https://youtu.be/N5FK6JtkAkA'),
      ch('Switch Case',                  'https://youtu.be/FCF01J5o8rU'),
      ch('Linear Search',                'https://youtu.be/5jkY2HLBitk'),
      ch('Binary Search',                'https://youtu.be/dUOKas7BhE0'),
      ch('Bubble Sort',                  'https://youtu.be/2WLpRXlyaXw'),
      ch('Selection Sort',               'https://youtu.be/qZKKL9RyqaA'),
      ch('2-D Array',                    'https://youtu.be/ZJ-Cb_zRxuI'),
      ch('Java Programming Basics',      'https://youtu.be/nQz-FcmwGH8'),
    ],
  },
];

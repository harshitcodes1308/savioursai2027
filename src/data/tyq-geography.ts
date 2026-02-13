// Geography — Real Specimen Paper Data (extracted from PDFs)
import { TYQPaper, TYQAnswerKey } from "./tyq-papers";

// ==========================================
// PAPER 1 — MOCK SPECIMEN PAPER 01 (2026)
// ==========================================

export const geographyPaper1: TYQPaper = {
  subject: "Geography",
  subjectId: "geography",
  paperNumber: 1,
  year: "2026",
  totalMarks: 80,
  sections: [
    {
      name: "Part I (30 Marks)",
      instructions: "Attempt all questions from this Part.",
      questions: [
        {
          number: "1",
          text: "Study the extract of the Survey of India Map Sheet No. G43S10 (provided separately) and answer the following questions:\n(i)(a) What is the six-figure grid reference of the triangulated height located in the southern part of the map? [1]\n(b) Identify the conventional symbol found at grid reference 6472. [1]\n(ii)(a) Calculate the direct distance in kilometers between Bhadli (grid square 6540) and Mori (grid square 7073). [2]\n(b) In which direction is the Dantiwari river flowing? Give one reason. [2]\n(iii)(a) What is the meaning of the brown contour lines with numbers? [1]\n(b) Identify the type of drainage pattern found in grid square 6680. [1]\n(iv)(a) Differentiate between settlement pattern in grid square 6540 and 7280. [2]\n(b) Why are causeways constructed across rivers in this region? [2]\n(v)(a) What is the compass direction of the Reserved Forest (grid square 7080) from the Police Station (grid square 6740)? [1]\n(b) Name any two means of communication available in the region. [2]",
          marks: 10
        },
        {
          number: "2",
          text: "On the outline map of India provided, mark and label the following:\n(i) The Tropic of Cancer [1]\n(ii) The Western Ghats [1]\n(iii) The Thar Desert [1]\n(iv) The River Godavari [1]\n(v) The Gulf of Khambhat [1]\n(vi) An area of Laterite soil in Peninsular India [1]\n(vii) The direction of the South-West Monsoon winds (Arabian Sea branch) [1]\n(viii) The Chota Nagpur Plateau [1]\n(ix) The city of Bengaluru [1]\n(x) The Palk Strait [1]",
          marks: 10
        },
        {
          number: "3",
          text: "Choose the correct answers to the questions from the given options.",
          marks: 10,
          subQuestions: [
            { number: "(i)", text: "The International Date Line roughly follows the:", options: ["0° longitude", "180° longitude", "90° East longitude", "Equator"], marks: 1 },
            { number: "(ii)", text: "Which of the following is a local wind that blows in India during the summer season?", options: ["Chinook", "Mistral", "Loo", "Foehn"], marks: 1 },
            { number: "(iii)", text: "Laterite soil is formed by the process of:", options: ["Leaching", "Deposition", "Weathering of granite", "Volcanic eruption"], marks: 1 },
            { number: "(iv)", text: "Assertion (A): The Gulf Stream is a warm ocean current.\nReason (R): It originates near the equator and flows towards the poles.", options: ["Both (A) and (R) are true, and (R) is the correct explanation of (A)", "Both (A) and (R) are true, but (R) is not the correct explanation of (A)", "A is true, but R is false", "A is false, but R is true"], marks: 1 },
            { number: "(v)", text: "Which of the following is a rabi crop?", options: ["Rice", "Wheat", "Cotton", "Jute"], marks: 1 },
            { number: "(vi)", text: "The Bhakra Nangal Dam is built on the river:", options: ["Ganga", "Sutlej", "Mahanadi", "Krishna"], marks: 1 },
            { number: "(vii)", text: "Tidal forests in India are also known as:", options: ["Tropical evergreen forests", "Mangrove forests", "Montane forests", "Deciduous forests"], marks: 1 },
            { number: "(viii)", text: "Which of the following is a non-conventional source of energy?", options: ["Coal", "Petroleum", "Natural gas", "Solar energy"], marks: 1 },
            { number: "(ix)", text: "The leading producer of coffee in India is:", options: ["Kerala", "Tamil Nadu", "Karnataka", "Andhra Pradesh"], marks: 1 },
            { number: "(x)", text: "The Golden Quadrilateral is a network of:", options: ["Railways", "Highways", "Waterways", "Airways"], marks: 1 }
          ]
        }
      ]
    },
    {
      name: "Part II (50 Marks)",
      instructions: "Attempt any five questions from this Part.",
      questions: [
        {
          number: "4",
          text: "Climate:\n(i) State any two factors that affect the climate of India. [2]\n(ii) Give a reason for each: (a) Mumbai has lower annual range of temperature than Delhi. (b) Tamil Nadu coast receives rainfall in winter. (c) Thar Desert has scanty rainfall. [3]\n(iii) Study the climatic data of Station X and answer: (a) Calculate annual range of temperature. (b) Hottest month. (c) Wettest month. (d) Name the wind bringing maximum rainfall. (e) Identify the climate type. [5]",
          marks: 10
        },
        {
          number: "5",
          text: "Soil Resources:\n(i) Differentiate between Bangar and Khadar. [2]\n(ii) With reference to Black Soil: (a) How is it formed? (b) Name two crops grown. (c) Name two states where found. [3]\n(iii) Give a reason for each: (a) Alluvial soil is found in river deltas. (b) Red soil lacks nitrogen and humus. (c) Hilly areas are prone to soil erosion. [3]\n(iv) Mention any two soil conservation methods. [2]",
          marks: 10
        },
        {
          number: "6",
          text: "Natural Vegetation:\n(i) State any two importance of forests. [2]\n(ii) Differentiate between Evergreen and Deciduous forests. [3]\n(iii) Give a reason for each: (a) Mangroves have stilted roots. (b) Desert plants have fleshy leaves. (c) Conical shape of mountain trees. [3]\n(iv) Name any two wildlife sanctuaries. [2]",
          marks: 10
        },
        {
          number: "7",
          text: "Water Resources:\n(i) What is rainwater harvesting? Mention one method. [2]\n(ii) State any three reasons for the need for irrigation. [3]\n(iii) Give a reason for each: (a) Northern Plains are suitable for canals. (b) Tanks dry up in summer. (c) Wells are useful in certain areas. [3]\n(iv) Mention two advantages of rainwater harvesting. [2]",
          marks: 10
        },
        {
          number: "8",
          text: "Mineral and Energy Resources:\n(i) Differentiate between conventional and non-conventional sources. [2]\n(ii) Iron Ore: (a) Uses. (b) States where found. [3]\n(iii) Give a reason for each: (a) Coal is called 'black gold'. (b) Petroleum is formed from ancient remains. (c) Natural gas is cleaner fuel. [3]\n(iv) Mention two advantages of solar energy. [2]",
          marks: 10
        },
        {
          number: "9",
          text: "Agriculture:\n(i) State any two problems of Indian agriculture. [2]\n(ii) Rice cultivation: (a) Climate. (b) Soil. (c) Leading state. [3]\n(iii) Give a reason for each: (a) Tea plants require shade. (b) Jute requires retting. (c) Sugarcane requires manual operations. [3]\n(iv) Differentiate between Rabi and Kharif crops with examples. [2]",
          marks: 10
        },
        {
          number: "10",
          text: "Manufacturing Industries:\n(i) State any two factors for industrial location. [2]\n(ii) Cotton Textile Industry: (a) Why agro-based? (b) Centres. (c) Problems. [3]\n(iii) Give a reason for each: (a) Iron and steel is a basic industry. (b) Petrochemical industry is located near refineries. (c) Sugar industry is seasonal. [3]\n(iv) Mention two advantages of small-scale industries. [2]",
          marks: 10
        },
        {
          number: "11",
          text: "Transport:\n(i) State any two advantages of road transport. [2]\n(ii) Give reasons: (a) Railways developed in Northern Plains. (b) Air transport is expensive. (c) Waterways are cheap. [3]\n(iii) Differentiate between NW1 and NW2. [3]\n(iv) Mention two disadvantages of air transport. [2]",
          marks: 10
        },
        {
          number: "12",
          text: "Waste Management:\n(i) What is waste segregation? State its importance. [2]\n(ii) Give reasons: (a) Open dumping causes pollution. (b) Composting is useful. (c) Recycling conserves resources. [3]\n(iii) State any three effects of waste accumulation. [3]\n(iv) Mention two methods to reduce waste. [2]",
          marks: 10
        }
      ]
    }
  ]
};

export const geographyPaper1Answers: TYQAnswerKey = {
  subject: "Geography",
  subjectId: "geography",
  paperNumber: 1,
  answers: [
    { questionNumber: "1(i)", answer: "(a) Six-figure grid reference of triangulated height in southern part.\n(b) Symbol at grid reference 6472 (e.g., Well/Temple)." },
    { questionNumber: "1(ii)", answer: "(a) Direct distance calculated using scale (e.g., 6.5 km).\n(b) River flows from higher contours to lower contours." },
    { questionNumber: "1(iii)", answer: "(a) Contour lines join places of equal height; numbers indicate height above mean sea level.\n(b) Dendritic / Trellis / Radial drainage pattern." },
    { questionNumber: "1(iv)", answer: "(a) Grid 6540: Scattered/Dispersed; Grid 7280: Nucleated/Compact.\n(b) Causeways allow crossing seasonal rivers during dry months; they are low-cost bridges." },
    { questionNumber: "1(v)", answer: "(a) Compass direction (e.g., North-East).\n(b) Any two: Metalled road, Unmetalled road, Railway line, Cart track, Footpath." },
    { questionNumber: "2", answer: "Map marking — to be checked visually by the student/teacher." },
    { questionNumber: "3(i)", answer: "(b) 180° longitude" },
    { questionNumber: "3(ii)", answer: "(c) Loo" },
    { questionNumber: "3(iii)", answer: "(a) Leaching" },
    { questionNumber: "3(iv)", answer: "(a) Both true, R explains A" },
    { questionNumber: "3(v)", answer: "(b) Wheat" },
    { questionNumber: "3(vi)", answer: "(b) Sutlej" },
    { questionNumber: "3(vii)", answer: "(b) Mangrove forests" },
    { questionNumber: "3(viii)", answer: "(d) Solar energy" },
    { questionNumber: "3(ix)", answer: "(c) Karnataka" },
    { questionNumber: "3(x)", answer: "(b) Highways" },
    { questionNumber: "4(i)", answer: "Factors: Latitude, Altitude, Distance from the sea, Relief, Monsoon winds. (Any two)" },
    { questionNumber: "4(ii)", answer: "(a) Mumbai is on the coast (moderating influence of sea); Delhi is inland with extreme climate.\n(b) Tamil Nadu receives rainfall from retreating/North-East monsoons in winter.\n(c) Thar Desert lies in the rain shadow of the Aravalli hills." },
    { questionNumber: "4(iii)", answer: "(a) Annual range = 33°C - 21°C = 12°C\n(b) Hottest month: May\n(c) Wettest month: July\n(d) South-West Monsoon\n(e) Tropical Monsoon" },
    { questionNumber: "5(i)", answer: "Bangar: Older alluvium, coarse, contains kankars, less fertile.\nKhadar: Newer alluvium, fine, deposited annually, more fertile." },
    { questionNumber: "5(ii)", answer: "(a) Formed by weathering of lava rocks (volcanic origin).\n(b) Crops: Cotton, Sugarcane, Groundnut, Jowar.\n(c) States: Maharashtra, Madhya Pradesh, Gujarat, Karnataka." },
    { questionNumber: "5(iii)", answer: "(a) Alluvial soil is deposited by rivers in their lower courses and deltas.\n(b) Red soil is porous and lacks nitrogen, phosphorus, and humus.\n(c) Hilly areas have steep slopes where running water removes topsoil." },
    { questionNumber: "5(iv)", answer: "Contour ploughing, Strip cropping, Shelter belts, Terrace farming, Afforestation. (Any two)" },
    { questionNumber: "6(i)", answer: "Provide oxygen, prevent soil erosion, bring rainfall, habitat for wildlife, timber, fuelwood. (Any two)" },
    { questionNumber: "6(ii)", answer: "Evergreen: No season to shed leaves, dense, hardwood (mahogany, ebony).\nDeciduous: Shed leaves in dry season, less dense (teak, sal, sandalwood)." },
    { questionNumber: "6(iii)", answer: "(a) Mangroves have stilted roots for support in muddy, waterlogged soil.\n(b) Desert plants have fleshy leaves to store water.\n(c) Conical shape helps shed snow in mountains." },
    { questionNumber: "6(iv)", answer: "Jim Corbett (Uttarakhand), Kaziranga (Assam), Periyar (Kerala), Ranthambore (Rajasthan). (Any two)" },
    { questionNumber: "7(i)", answer: "Collecting and storing rainwater for future use. Methods: Rooftop harvesting, Percolation pits, Check dams." },
    { questionNumber: "7(ii)", answer: "Erratic rainfall, Uneven distribution of rainfall, Water-intensive crops, Multiple cropping. (Any three)" },
    { questionNumber: "7(iii)", answer: "(a) Northern Plains have perennial rivers and gentle slope for canals.\n(b) Tanks dry up due to evaporation and lack of rainfall.\n(c) Wells work where groundwater table is high." },
    { questionNumber: "7(iv)", answer: "Recharges groundwater, Reduces water scarcity, Prevents flooding, Improves water quality. (Any two)" },
    { questionNumber: "8(i)", answer: "Conventional: Exhaustible (coal, petroleum, natural gas).\nNon-conventional: Renewable (solar, wind, tidal, biogas)." },
    { questionNumber: "8(ii)", answer: "(a) Uses: Making steel, machinery, construction, railways.\n(b) States: Odisha, Jharkhand, Chhattisgarh, Karnataka, Goa." },
    { questionNumber: "8(iii)", answer: "(a) Coal is valuable as fuel and industrial resource.\n(b) Petroleum formed from ancient plants and animals buried underground.\n(c) Natural gas burns without smoke, less pollution." },
    { questionNumber: "8(iv)", answer: "Renewable, Eco-friendly, Reduces fossil fuel dependence, Abundant in India. (Any two)" },
    { questionNumber: "9(i)", answer: "Monsoon dependence, Small landholdings, Lack of modern equipment, Poverty, Lack of irrigation. (Any two)" },
    { questionNumber: "9(ii)", answer: "(a) Climate: High temperature (25°C+) and high rainfall (150 cm+).\n(b) Soil: Alluvial soil / Clayey loam.\n(c) Leading state: West Bengal / Punjab / Uttar Pradesh." },
    { questionNumber: "9(iii)", answer: "(a) Tea plants are sensitive to direct sunlight.\n(b) Jute requires retting (soaking in water) to separate fibres.\n(c) Sugarcane requires many manual operations." },
    { questionNumber: "9(iv)", answer: "Rabi: Sown in winter, harvested in spring (Wheat, Gram, Mustard).\nKharif: Sown in monsoon, harvested in autumn (Rice, Cotton, Jowar)." },
    { questionNumber: "10(i)", answer: "Raw material, Power, Labour, Market, Transport, Capital. (Any two)" },
    { questionNumber: "10(ii)", answer: "(a) Agro-based: uses cotton (agricultural product) as raw material.\n(b) Centres: Mumbai, Ahmedabad, Coimbatore, Surat, Kanpur.\n(c) Problems: Erratic power, Old machinery, Competition with synthetic fibres." },
    { questionNumber: "10(iii)", answer: "(a) Iron and steel provides raw material for other industries.\n(b) Petrochemical near refineries for easy raw material availability.\n(c) Sugar industry is seasonal because sugarcane harvesting is seasonal." },
    { questionNumber: "10(iv)", answer: "Less capital, More employment, Decentralization, Use local resources. (Any two)" },
    { questionNumber: "11(i)", answer: "Flexible, Door-to-door service, Low construction cost, Good for short distances. (Any two)" },
    { questionNumber: "11(ii)", answer: "(a) Flat terrain, high population, agricultural productivity.\n(b) Air transport is expensive with limited cargo.\n(c) Waterways use natural tracks with high fuel efficiency." },
    { questionNumber: "11(iii)", answer: "NW1: Allahabad to Haldia on Ganga-Bhagirathi-Hooghly.\nNW2: Sadiya to Dhubri on Brahmaputra." },
    { questionNumber: "11(iv)", answer: "Expensive, Limited to major cities, Weather-affected, Not for heavy goods. (Any two)" },
    { questionNumber: "12(i)", answer: "Separating waste into biodegradable and non-biodegradable. Makes recycling easier, reduces landfill burden." },
    { questionNumber: "12(ii)", answer: "(a) Open dumping causes soil/water pollution, pests, foul smell.\n(b) Composting turns organic waste into useful manure.\n(c) Recycling conserves resources, saves energy, reduces pollution." },
    { questionNumber: "12(iii)", answer: "Land pollution, Water pollution, Air pollution, Health hazards, Landscape spoilage. (Any three)" },
    { questionNumber: "12(iv)", answer: "Use cloth bags, Avoid single-use plastics, Compost kitchen waste, Reuse containers. (Any two)" }
  ]
};

// ==========================================
// PAPER 2 — MOCK SPECIMEN PAPER 02 (2026)
// ==========================================

export const geographyPaper2: TYQPaper = {
  subject: "Geography",
  subjectId: "geography",
  paperNumber: 2,
  year: "2026",
  totalMarks: 80,
  sections: [
    {
      name: "Part I (30 Marks)",
      instructions: "Attempt all questions from this Part.",
      questions: [
        {
          number: "1",
          text: "Study the extract of the Survey of India Map Sheet No. G43S10 (provided separately) and answer the following questions:\n(i)(a) Give the four-figure grid reference of the settlement of Pamera. [1]\n(b) What is the conventional symbol found at grid reference 6682? [1]\n(ii)(a) Measure the direct distance in km between the temple (grid square 6544) and the well (grid square 7076). [2]\n(b) What is the general direction of flow of the main river? [2]\n(iii)(a) What do the black dotted lines in grid square 6380 represent? [1]\n(b) Identify the type of slope found in grid square 7278 based on contour lines. [1]\n(iv)(a) Compare the drainage pattern in grid square 6585 and 6875. [2]\n(b) Why are fire lines important in reserved forests? [2]\n(v)(a) What is the compass direction of the Police Station (6740) from the Post Office (6664)? [1]\n(b) Name any two natural features shown in the map. [2]",
          marks: 10
        },
        {
          number: "2",
          text: "On the outline map of India provided, mark and label the following:\n(i) The Eastern Ghats [1]\n(ii) The River Krishna [1]\n(iii) The Gulf of Mannar [1]\n(iv) An area of Alluvial soil in North India [1]\n(v) The direction of the North-East Monsoon winds [1]\n(vi) The Karakoram Mountain range [1]\n(vii) The city of Chennai [1]\n(viii) The Chilka Lake [1]\n(ix) The Standard Meridian of India [1]\n(x) A sparsely populated area in Western India [1]",
          marks: 10
        },
        {
          number: "3",
          text: "Choose the correct answers to the questions from the given options.",
          marks: 10,
          subQuestions: [
            { number: "(i)", text: "The earth's rotation causes:", options: ["Seasons", "Day and night", "Solstices", "Equinoxes"], marks: 1 },
            { number: "(ii)", text: "The Chinook is a:", options: ["Hot local wind", "Cold local wind", "Permanent wind", "Seasonal wind"], marks: 1 },
            { number: "(iii)", text: "Red Soil is red in colour due to the presence of:", options: ["Humus", "Iron oxide", "Aluminium", "Calcium"], marks: 1 },
            { number: "(iv)", text: "Assertion (A): The Labrador Current is a cold ocean current.\nReason (R): It originates in the polar region and flows towards the equator.", options: ["Both (A) and (R) are true, and (R) is the correct explanation of (A)", "Both (A) and (R) are true, but (R) is not the correct explanation of (A)", "A is true, but R is false", "A is false, but R is true"], marks: 1 },
            { number: "(v)", text: "Which of the following is a kharif crop?", options: ["Wheat", "Barley", "Cotton", "Mustard"], marks: 1 },
            { number: "(vi)", text: "The Hirakud Dam is built on the river:", options: ["Godavari", "Krishna", "Mahanadi", "Narmada"], marks: 1 },
            { number: "(vii)", text: "Tropical Deciduous forests are also known as:", options: ["Monsoon forests", "Rain forests", "Mangrove forests", "Alpine forests"], marks: 1 },
            { number: "(viii)", text: "Which of the following is a conventional source of energy?", options: ["Wind energy", "Solar energy", "Natural gas", "Biogas"], marks: 1 },
            { number: "(ix)", text: "The leading producer of tea in India is:", options: ["Assam", "West Bengal", "Kerala", "Tamil Nadu"], marks: 1 },
            { number: "(x)", text: "The National Waterway No. 1 is on the river:", options: ["Brahmaputra", "Ganga", "Godavari", "Krishna"], marks: 1 }
          ]
        }
      ]
    },
    {
      name: "Part II (50 Marks)",
      instructions: "Attempt any five questions from this Part.",
      questions: [
        {
          number: "4",
          text: "Climate:\n(i) What is monsoon? Name the two branches of the South-West Monsoon. [2]\n(ii) Give a reason for each: (a) Mawsynram receives the highest rainfall. (b) Coromandel coast receives less rainfall from SW Monsoon. (c) Western disturbances cause rainfall in NW India. [3]\n(iii) Study the climatic data of Station Y and answer: (a) Calculate total annual rainfall. (b) Coldest month. (c) Rainiest month. (d) Season with maximum rainfall. (e) Identify climate type. [5]",
          marks: 10
        },
        {
          number: "5",
          text: "Soil Resources:\n(i) Differentiate between Alluvial Soil and Laterite Soil. [2]\n(ii) With reference to Red Soil: (a) How is it formed? (b) Name two crops. (c) Name two states. [3]\n(iii) Give a reason for each: (a) Black soil ideal for cotton. (b) Laterite soil not suitable for agriculture. (c) Khadar more fertile than Bangar. [3]\n(iv) Mention two causes of soil erosion. [2]",
          marks: 10
        },
        {
          number: "6",
          text: "Natural Vegetation:\n(i) What is social forestry? State its importance. [2]\n(ii) Differentiate between Tidal and Desert vegetation. [3]\n(iii) Give reasons: (a) Multiple layers in evergreen forests. (b) Deciduous forests provide valuable timber. (c) Long roots of desert plants. [3]\n(iv) Name two trees in Deciduous forests. [2]",
          marks: 10
        },
        {
          number: "7",
          text: "Water Resources:\n(i) What is irrigation? Mention two methods. [2]\n(ii) State any three reasons for water conservation. [3]\n(iii) Give reasons: (a) Tanks common in Peninsular India. (b) Tube wells popular in Punjab. (c) Canal construction costly in South India. [3]\n(iv) Mention two rainwater harvesting methods. [2]",
          marks: 10
        },
        {
          number: "8",
          text: "Mineral and Energy Resources:\n(i) Differentiate between Ferrous and Non-ferrous minerals. [2]\n(ii) Bauxite: (a) Use. (b) States where found. [3]\n(iii) Give reasons: (a) Petroleum is 'liquid gold'. (b) Natural gas burns without smoke. (c) Damodar Valley has rich coal deposits. [3]\n(iv) Mention two advantages of wind energy. [2]",
          marks: 10
        },
        {
          number: "9",
          text: "Agriculture:\n(i) State any two agricultural reforms. [2]\n(ii) Wheat cultivation: (a) Climate. (b) Soil. (c) Leading state. [3]\n(iii) Give reasons: (a) Cotton requires black soil. (b) Jute is 'golden fibre'. (c) Tea requires sloping land. [3]\n(iv) Differentiate between Subsistence and Commercial farming. [2]",
          marks: 10
        },
        {
          number: "10",
          text: "Manufacturing Industries:\n(i) State any two problems of iron and steel industry. [2]\n(ii) Sugar Industry: (a) Why agro-based? (b) States. (c) Problem. [3]\n(iii) Give reasons: (a) Cotton textile in Maharashtra/Gujarat. (b) Petrochemical industry growing. (c) Small-scale industries provide more employment. [3]\n(iv) Factors for industrial location in Chota Nagpur. [2]",
          marks: 10
        },
        {
          number: "11",
          text: "Transport:\n(i) State any two advantages of waterways. [2]\n(ii) Give reasons: (a) Air transport is fast. (b) Railways carry bulk goods. (c) Roads can be built in hilly terrain. [3]\n(iii) Differentiate between National and State Highways. [3]\n(iv) Mention two disadvantages of railways. [2]",
          marks: 10
        },
        {
          number: "12",
          text: "Waste Management:\n(i) What is composting? State its advantages. [2]\n(ii) Give reasons: (a) Mixing waste hinders recycling. (b) Plastic is harmful. (c) Incineration can release toxic gases. [3]\n(iii) State any three effects of waste on human health. [3]\n(iv) Mention two community recycling methods. [2]",
          marks: 10
        }
      ]
    }
  ]
};

export const geographyPaper2Answers: TYQAnswerKey = {
  subject: "Geography",
  subjectId: "geography",
  paperNumber: 2,
  answers: [
    { questionNumber: "1(i)", answer: "(a) Four-figure grid reference (e.g., 6540).\n(b) Symbol at grid reference 6682 (e.g., Well/Temple/Police Station)." },
    { questionNumber: "1(ii)", answer: "(a) Calculated distance (e.g., 6.8 km).\n(b) Direction: South-West to North-East." },
    { questionNumber: "1(iii)", answer: "(a) Black dotted lines represent footpaths or cart tracks.\n(b) Steep slope / Gentle slope based on contour spacing." },
    { questionNumber: "1(iv)", answer: "(a) Grid 6585: Dendritic; Grid 6875: Trellis/Radial.\n(b) Fire lines prevent forest fires from spreading and help firefighting." },
    { questionNumber: "1(v)", answer: "(a) Direction: South-West.\n(b) Natural features: River, Forest, Hills, Contours. (Any two)" },
    { questionNumber: "2", answer: "Map marking — to be checked visually by the student/teacher." },
    { questionNumber: "3(i)", answer: "(b) Day and night" },
    { questionNumber: "3(ii)", answer: "(a) Hot local wind" },
    { questionNumber: "3(iii)", answer: "(b) Iron oxide" },
    { questionNumber: "3(iv)", answer: "(a) Both true, R explains A" },
    { questionNumber: "3(v)", answer: "(c) Cotton" },
    { questionNumber: "3(vi)", answer: "(c) Mahanadi" },
    { questionNumber: "3(vii)", answer: "(a) Monsoon forests" },
    { questionNumber: "3(viii)", answer: "(c) Natural gas" },
    { questionNumber: "3(ix)", answer: "(a) Assam" },
    { questionNumber: "3(x)", answer: "(b) Ganga" },
    { questionNumber: "4(i)", answer: "Monsoon: Seasonal reversal of winds. Branches: Arabian Sea branch and Bay of Bengal branch." },
    { questionNumber: "4(ii)", answer: "(a) Mawsynram is on the windward side of Khasi Hills; gets heavy orographic rainfall.\n(b) Coromandel coast lies in the rain shadow of Western Ghats during SW monsoons.\n(c) Western disturbances are temperate cyclones from Mediterranean, causing winter rain." },
    { questionNumber: "4(iii)", answer: "(a) Total annual rainfall: 72.5 cm\n(b) Coldest month: January (14°C)\n(c) Rainiest month: July (19.0 cm)\n(d) Season: Summer Monsoon (June to September)\n(e) Climate type: Tropical Monsoon / Tropical Continental" },
    { questionNumber: "5(i)", answer: "Alluvial: River deposits, fertile, found in plains.\nLaterite: Leaching, rich in iron, poor in humus, found in hills." },
    { questionNumber: "5(ii)", answer: "(a) Formed by weathering of crystalline and metamorphic rocks (granite, gneiss).\n(b) Crops: Ragi, Groundnut, Tobacco, Millets.\n(c) States: Tamil Nadu, Karnataka, Andhra Pradesh, Odisha." },
    { questionNumber: "5(iii)", answer: "(a) Black soil's clayey texture retains moisture, ideal for cotton.\n(b) Laterite soil is leached and lacks fertility due to heavy rainfall.\n(c) Khadar is replenished annually by river floods, so more fertile." },
    { questionNumber: "5(iv)", answer: "Deforestation, Overgrazing, Unscientific farming, Wind, Water. (Any two)" },
    { questionNumber: "6(i)", answer: "Social forestry: Planting trees on community lands for local needs (fuelwood, fodder, shade, soil conservation)." },
    { questionNumber: "6(ii)", answer: "Tidal: Found in deltas, salt-tolerant, stilted roots (mangroves).\nDesert: Found in arid regions, thorny, fleshy leaves, long roots." },
    { questionNumber: "6(iii)", answer: "(a) High temperature and rainfall allow multiple layers.\n(b) Deciduous forests provide valuable timber (teak, sal).\n(c) Long roots absorb water from deep underground." },
    { questionNumber: "6(iv)", answer: "Teak, Sal, Sandalwood, Peepal, Neem. (Any two)" },
    { questionNumber: "7(i)", answer: "Irrigation: Artificial supply of water to crops. Methods: Wells, Tube wells, Canals, Tanks." },
    { questionNumber: "7(ii)", answer: "Uneven rainfall, Growing population, Overexploitation of groundwater, Industrial needs. (Any three)" },
    { questionNumber: "7(iii)", answer: "(a) Tanks common in Peninsular India due to hard rocks and undulating terrain.\n(b) Tube wells popular in Punjab due to high groundwater and electricity.\n(c) Canal construction costly in South India due to hard rocks and hilly terrain." },
    { questionNumber: "7(iv)", answer: "Rooftop harvesting, Percolation pits, Check dams, Johads, Kunds. (Any two)" },
    { questionNumber: "8(i)", answer: "Ferrous: Containing iron (Iron ore, Manganese).\nNon-ferrous: Without iron (Bauxite, Copper)." },
    { questionNumber: "8(ii)", answer: "(a) Ore of aluminium; used in aircraft, utensils, electrical goods.\n(b) States: Odisha, Gujarat, Jharkhand, Maharashtra." },
    { questionNumber: "8(iii)", answer: "(a) Petroleum is valuable for many products (fuel, plastics).\n(b) Natural gas burns without smoke, less CO2.\n(c) Damodar Valley has rich Gondwana coal fields." },
    { questionNumber: "8(iv)", answer: "Renewable, Eco-friendly, Low operating cost, Suitable for coastal areas. (Any two)" },
    { questionNumber: "9(i)", answer: "Green Revolution, Subsidies, Minimum Support Price, Irrigation facilities, Rural credit. (Any two)" },
    { questionNumber: "9(ii)", answer: "(a) Climate: Cool growing season, 20-25°C, 50-75 cm rainfall.\n(b) Soil: Well-drained loamy soil / Alluvial soil.\n(c) Leading state: Uttar Pradesh / Punjab / Haryana." },
    { questionNumber: "9(iii)", answer: "(a) Cotton requires black soil for high moisture retention.\n(b) Jute is 'golden fibre' — valuable for foreign exchange and golden in colour.\n(c) Sloping land ensures drainage; tea plants need well-drained conditions." },
    { questionNumber: "9(iv)", answer: "Subsistence: Self-consumption, small holdings, traditional methods.\nCommercial: For sale, large holdings, modern inputs." },
    { questionNumber: "10(i)", answer: "High cost of power, Old technology, Limited capital, Competition. (Any two)" },
    { questionNumber: "10(ii)", answer: "(a) Uses sugarcane (agricultural product) as raw material.\n(b) States: UP, Maharashtra, Karnataka, Tamil Nadu.\n(c) Seasonal nature, Low yield, Competition with gur/khandsari." },
    { questionNumber: "10(iii)", answer: "(a) Cotton textile in Maharashtra/Gujarat due to cotton areas, humid climate, port facilities.\n(b) Petrochemical growing due to demand for plastics, synthetic fibres.\n(c) Small-scale industries provide more employment with less capital." },
    { questionNumber: "10(iv)", answer: "Proximity to coal (Jharia) and iron ore (Singhbhum), Cheap labour, Water from Damodar." },
    { questionNumber: "11(i)", answer: "Cheap, Eco-friendly, Suitable for heavy goods, No congestion. (Any two)" },
    { questionNumber: "11(ii)", answer: "(a) Air transport delivers perishable goods quickly.\n(b) Railways carry bulk goods over long distances.\n(c) Roads reach remote hilly areas through cuts and tunnels." },
    { questionNumber: "11(iii)", answer: "National: Connects states, maintained by Central government.\nState: Connects within a state, maintained by State government." },
    { questionNumber: "11(iv)", answer: "High construction cost, Not flexible, Cannot reach remote areas, Accident risk. (Any two)" },
    { questionNumber: "12(i)", answer: "Composting: Biological process converting organic waste to manure. Reduces waste, provides fertilizer, eco-friendly." },
    { questionNumber: "12(ii)", answer: "(a) Mixing waste hinders both composting and recycling.\n(b) Plastic is non-biodegradable, pollutes soil/water, harms animals.\n(c) Incineration can release toxic gases (dioxins) if not controlled." },
    { questionNumber: "12(iii)", answer: "Respiratory problems, Waterborne diseases, Skin infections, Spread of vectors. (Any three)" },
    { questionNumber: "12(iv)", answer: "Segregation at source, Collection drives, Recycling centers, Awareness campaigns. (Any two)" }
  ]
};

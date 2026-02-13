// History & Civics — Real Specimen Paper Data (extracted from PDFs)
import { TYQPaper, TYQAnswerKey } from "./tyq-papers";

// ==========================================
// PAPER 1 — MOCK SPECIMEN PAPER 01 (2026)
// ==========================================
export const historyCivicsPaper1: TYQPaper = {
  subject: "History & Civics",
  subjectId: "history-civics",
  paperNumber: 1,
  year: "2026",
  totalMarks: 80,
  sections: [
    {
      name: "Part I — Compulsory (30 Marks)",
      instructions: "Attempt all questions from this Part.",
      questions: [
        {
          number: "1",
          text: "Choose the correct answers to the questions from the given options. (Do not copy the question, write the correct answers only.)",
          marks: 16,
          subQuestions: [
            {
              number: "(i)",
              text: "Which of the following statements correctly describes a feature of the Indian Constitution?",
              options: [
                "It provides for Dual Citizenship.",
                "It was adopted on 26th January, 1950.",
                "It establishes a theocratic state.",
                "It is a completely rigid document."
              ],
              marks: 1
            },
            {
              number: "(ii)",
              text: "During a general election, the Election Commission of India has the power to:",
              options: [
                "Change the boundaries of constituencies.",
                "Appoint the Chief Election Commissioner.",
                "Postpone or cancel an election in a constituency if irregularities are found.",
                "Decide who can stand for election."
              ],
              marks: 1
            },
            {
              number: "(iii)",
              text: "Which of the following is an exclusive power of the Lok Sabha regarding finances?",
              options: [
                "Introducing a Money Bill.",
                "Ratifying a Financial Emergency.",
                "Passing the Annual Financial Statement.",
                "Approving the Contingency Fund of India."
              ],
              marks: 1
            },
            {
              number: "(iv)",
              text: "The President of India can be removed from office by:",
              options: [
                "The Prime Minister",
                "The Chief Justice of India",
                "Impeachment by Parliament",
                "A vote of no-confidence in the Lok Sabha"
              ],
              marks: 1
            },
            {
              number: "(v)",
              text: "Assertion (A): The Council of Ministers is collectively responsible to the Lok Sabha.\nReason (R): The Lok Sabha can pass a No-Confidence Motion against the Council of Ministers, forcing them to resign.",
              options: [
                "Both (A) and (R) are true, and (R) is the correct explanation of (A).",
                "Both (A) and (R) are true, but (R) is not the correct explanation of (A).",
                "(A) is true, but (R) is false.",
                "(A) is false, but (R) is true."
              ],
              marks: 1
            },
            {
              number: "(vi)",
              text: "Identify the odd one out based on their contribution to socio-religious reform:",
              options: [
                "Raja Rammohan Roy",
                "Jyotiba Phule",
                "Dadabhai Naoroji",
                "Both (a) and (b)"
              ],
              marks: 1
            },
            {
              number: "(vii)",
              text: "Arrange the following events in chronological order:\n1. Formation of the Muslim League\n2. Partition of Bengal\n3. Surat Split of the Indian National Congress",
              options: [
                "1, 2, 3",
                "2, 1, 3",
                "3, 2, 1",
                "2, 3, 1"
              ],
              marks: 1
            },
            {
              number: "(viii)",
              text: "The Jallianwala Bagh massacre took place in the city of:",
              options: ["Lahore", "Amritsar", "Delhi", "Calcutta"],
              marks: 1
            },
            {
              number: "(ix)",
              text: "Read the following description and identify the person:\n\"I was a leader of the Assertive Nationalists. I started the newspapers 'Kesari' and 'Maratha'. I famously declared, 'Swaraj is my birthright and I shall have it.'\"",
              options: [
                "Lala Lajpat Rai",
                "Bipin Chandra Pal",
                "Aurobindo Ghosh",
                "Bal Gangadhar Tilak"
              ],
              marks: 1
            },
            {
              number: "(x)",
              text: "The immediate cause of the First World War was:",
              options: [
                "The policy of imperialism",
                "The formation of alliances",
                "The assassination of Archduke Franz Ferdinand",
                "The naval race between Britain and Germany"
              ],
              marks: 1
            },
            {
              number: "(xi)",
              text: "A country today wants to maintain friendly relations with all nations and stay out of military alliances. This policy is known as:",
              options: ["Imperialism", "Fascism", "Non-Alignment", "Appeasement"],
              marks: 1
            },
            {
              number: "(xii)",
              text: "Which UN agency would be primarily responsible for running a global vaccination drive for children?",
              options: ["WHO", "UNICEF", "UNESCO", "ILO"],
              marks: 1
            },
            {
              number: "(xiii)",
              text: "The Cabinet Mission Plan is significant in Indian history because it:",
              options: [
                "Accepted the demand for Pakistan.",
                "Proposed a federal union with provincial autonomy.",
                "Announced the date for India's independence.",
                "Led to the Partition of Bengal."
              ],
              marks: 1
            },
            {
              number: "(xiv)",
              text: "Assertion (A): Mahatma Gandhi suspended the Non-Cooperation Movement in 1922.\nReason (R): The movement had turned violent in Chauri Chaura.",
              options: [
                "Both (A) and (R) are true, and (R) is the correct explanation of (A).",
                "Both (A) and (R) are true, but (R) is not the correct explanation of (A).",
                "(A) is true, but (R) is false.",
                "(A) is false, but (R) is true."
              ],
              marks: 1
            },
            {
              number: "(xv)",
              text: "The main architect of the Non-Aligned Movement (NAM) from India was:",
              options: [
                "Mahatma Gandhi",
                "Sardar Vallabhbhai Patel",
                "Jawaharlal Nehru",
                "Dr. B.R. Ambedkar"
              ],
              marks: 1
            },
            {
              number: "(xvi)",
              text: "The main function of the International Court of Justice (ICJ) is to:",
              options: [
                "Prosecute war criminals.",
                "Maintain peacekeeping forces.",
                "Settle legal disputes between member states.",
                "Make recommendations on human rights."
              ],
              marks: 1
            }
          ]
        },
        {
          number: "2",
          text: "",
          marks: 14,
          subQuestions: [
            {
              number: "(i)",
              text: "What is the meaning of the term 'Quorum' in the context of the Indian Parliament? Who presides over a joint sitting of both Houses of Parliament?",
              marks: 2
            },
            {
              number: "(ii)",
              text: "In which type of case does the Supreme Court have Original Jurisdiction? Mention any one writ it can issue to enforce Fundamental Rights.",
              marks: 2
            },
            {
              number: "(iii)",
              text: "Mention two reasons why the economic policies of the British are considered a major cause of the First War of Independence in 1857.",
              marks: 2
            },
            {
              number: "(iv)",
              text: "Identify the leader in the given image and name the organization he founded. (Imagine a picture of Subhas Chandra Bose)",
              marks: 2
            },
            {
              number: "(v)",
              text: "Why was the Simon Commission boycotted by Indians?",
              marks: 2
            },
            {
              number: "(vi)",
              text: "State any two objectives of the United Nations.",
              marks: 2
            },
            {
              number: "(vii)",
              text: "What is meant by the policy of 'Appeasement'? Name the two countries that followed this policy.",
              marks: 2
            }
          ]
        }
      ]
    },
    {
      name: "Part II — Section A: Civics (Attempt any TWO)",
      instructions: "Attempt any two questions from this Section.",
      questions: [
        {
          number: "3",
          text: "The Union Legislature",
          marks: 10,
          subQuestions: [
            {
              number: "(i)",
              text: "Explain the composition of the Rajya Sabha. How are its members elected?",
              marks: 3
            },
            {
              number: "(ii)",
              text: "Differentiate between an 'Adjournment Motion' and a 'No-Confidence Motion'.",
              marks: 3
            },
            {
              number: "(iii)",
              text: "Describe any four financial powers of the Union Parliament.",
              marks: 4
            }
          ]
        },
        {
          number: "4",
          text: "The Union Executive",
          marks: 10,
          subQuestions: [
            {
              number: "(i)",
              text: "Mention the qualifications required to be elected as the President of India.",
              marks: 3
            },
            {
              number: "(ii)",
              text: "Explain any three Executive powers of the President.",
              marks: 3
            },
            {
              number: "(iii)",
              text: "Distinguish between the Council of Ministers and the Cabinet.",
              marks: 4
            }
          ]
        },
        {
          number: "5",
          text: "The Judiciary",
          marks: 10,
          subQuestions: [
            {
              number: "(i)",
              text: "How are the judges of the High Courts appointed? Mention one condition of service that ensures their independence.",
              marks: 3
            },
            {
              number: "(ii)",
              text: "What is meant by 'Judicial Review'? Why is it important?",
              marks: 3
            },
            {
              number: "(iii)",
              text: "Explain any two advantages of Lok Adalats.",
              marks: 4
            }
          ]
        }
      ]
    },
    {
      name: "Part II — Section B: History (Attempt any THREE)",
      instructions: "Attempt any three questions from this Section.",
      questions: [
        {
          number: "6",
          text: "The First War of Independence and Growth of Nationalism",
          marks: 10,
          subQuestions: [
            {
              number: "(i)",
              text: "Mention any three political causes that led to the Revolt of 1857.",
              marks: 3
            },
            {
              number: "(ii)",
              text: "The immediate cause of the Revolt of 1857 was the 'greased cartridges'. Analyse how this seemingly small issue sparked a massive uprising.",
              marks: 3
            },
            {
              number: "(iii)",
              text: "Explain the role of the Press in the growth of nationalism in India during the 19th century.",
              marks: 4
            }
          ]
        },
        {
          number: "7",
          text: "The Mass Phase of the National Movement",
          marks: 10,
          subQuestions: [
            {
              number: "(i)",
              text: "Read the passage and answer: \"On March 12, 1930, Gandhi and a group of 78 satyagrahis set out on a 240-mile march from Sabarmati Ashram to the coastal village of Dandi. On April 6, he broke the salt law by picking up a handful of salt.\" Which famous movement was launched by this act? In which year did it take place?",
              marks: 2
            },
            {
              number: "(ii)",
              text: "State any two causes that led to this movement.",
              marks: 2
            },
            {
              number: "(iii)",
              text: "Analyse any three impacts of this movement on the Indian freedom struggle.",
              marks: 6
            }
          ]
        },
        {
          number: "8",
          text: "The Muslim League, Forward Bloc, INA and Road to Independence",
          marks: 10,
          subQuestions: [
            {
              number: "(i)",
              text: "Mention two objectives of the Indian National Army (INA) formed by Subhas Chandra Bose.",
              marks: 2
            },
            {
              number: "(ii)",
              text: "Why did the Muslim League celebrate 'Direct Action Day' in 1946? What were its consequences?",
              marks: 2
            },
            {
              number: "(iii)",
              text: "Give any four reasons for the acceptance of the Mountbatten Plan by the Indian National Congress.",
              marks: 6
            }
          ]
        },
        {
          number: "9",
          text: "The Contemporary World (World Wars and Dictatorships)",
          marks: 10,
          subQuestions: [
            {
              number: "(i)",
              text: "Explain any three causes of the Second World War.",
              marks: 3
            },
            {
              number: "(ii)",
              text: "Compare the ideologies of Fascism in Italy and Nazism in Germany on any two points.",
              marks: 3
            },
            {
              number: "(iii)",
              text: "State any four consequences of the First World War.",
              marks: 4
            }
          ]
        },
        {
          number: "10",
          text: "The United Nations and the Non-Aligned Movement",
          marks: 10,
          subQuestions: [
            {
              number: "(i)",
              text: "Name the principal judicial organ of the UN. What is its composition?",
              marks: 3
            },
            {
              number: "(ii)",
              text: "Mention any three functions of the General Assembly.",
              marks: 3
            },
            {
              number: "(iii)",
              text: "Explain the meaning and any two objectives of the Non-Aligned Movement (NAM).",
              marks: 4
            }
          ]
        }
      ]
    }
  ]
};

// ==========================================
// PAPER 1 — ANSWER KEY
// ==========================================
export const historyCivicsPaper1Answers: TYQAnswerKey = {
  subject: "History & Civics",
  subjectId: "history-civics",
  paperNumber: 1,
  answers: [
    // Question 1 MCQs
    { questionNumber: "1(i)", answer: "(b) It was adopted on 26th January, 1950.", explanation: "The Indian Constitution was adopted on 26 Nov 1949 but came into effect on 26 Jan 1950. It provides single citizenship, is a secular state, and is partly rigid/partly flexible." },
    { questionNumber: "1(ii)", answer: "(c) Postpone or cancel an election in a constituency if irregularities are found.", explanation: "The ECI can postpone/cancel elections if irregularities are found to ensure free and fair elections." },
    { questionNumber: "1(iii)", answer: "(a) Introducing a Money Bill.", explanation: "Money Bills can only be introduced in the Lok Sabha. The Rajya Sabha can only recommend amendments within 14 days." },
    { questionNumber: "1(iv)", answer: "(c) Impeachment by Parliament", explanation: "The President can only be removed by impeachment. The process starts in either House and requires a special majority in both Houses." },
    { questionNumber: "1(v)", answer: "(a) Both (A) and (R) are true, and (R) is the correct explanation of (A).", explanation: "The Council of Ministers is collectively responsible to Lok Sabha, which exercises this control through No-Confidence Motions." },
    { questionNumber: "1(vi)", answer: "(c) Dadabhai Naoroji", explanation: "Raja Rammohan Roy and Jyotiba Phule were socio-religious reformers. Dadabhai Naoroji was primarily a political leader and economist (Grand Old Man of India)." },
    { questionNumber: "1(vii)", answer: "(b) 2, 1, 3", explanation: "Partition of Bengal (1905), Formation of Muslim League (1906), Surat Split (1907)." },
    { questionNumber: "1(viii)", answer: "(b) Amritsar", explanation: "The Jallianwala Bagh massacre took place on 13 April 1919 in Amritsar, Punjab, when General Dyer ordered troops to fire on a peaceful gathering." },
    { questionNumber: "1(ix)", answer: "(d) Bal Gangadhar Tilak", explanation: "Tilak started 'Kesari' (Marathi) and 'Maratha' (English) newspapers and coined the famous slogan 'Swaraj is my birthright and I shall have it.'" },
    { questionNumber: "1(x)", answer: "(c) The assassination of Archduke Franz Ferdinand", explanation: "The assassination of Archduke Franz Ferdinand of Austria-Hungary in Sarajevo (28 June 1914) was the immediate trigger of WWI." },
    { questionNumber: "1(xi)", answer: "(c) Non-Alignment", explanation: "Non-Alignment is the policy of not joining any military bloc and maintaining friendly relations with all nations." },
    { questionNumber: "1(xii)", answer: "(b) UNICEF", explanation: "UNICEF (United Nations Children's Fund) works for child welfare including vaccination drives." },
    { questionNumber: "1(xiii)", answer: "(b) Proposed a federal union with provincial autonomy.", explanation: "The Cabinet Mission (1946) rejected Pakistan, proposed a federal union with provincial autonomy and formed the Interim Government." },
    { questionNumber: "1(xiv)", answer: "(a) Both (A) and (R) are true, and (R) is the correct explanation of (A).", explanation: "Gandhi suspended the Non-Cooperation Movement in Feb 1922 after the violent incident at Chauri Chaura where a mob set fire to a police station." },
    { questionNumber: "1(xv)", answer: "(c) Jawaharlal Nehru", explanation: "Nehru, along with Tito (Yugoslavia) and Nasser (Egypt), was a founding architect of the Non-Aligned Movement." },
    { questionNumber: "1(xvi)", answer: "(c) Settle legal disputes between member states.", explanation: "The ICJ settles legal disputes between nations and gives advisory opinions on legal questions referred by UN organs." },

    // Question 2 Short Answers
    { questionNumber: "2(i)", answer: "Quorum is the minimum number of members required to be present for a valid meeting. The Speaker of Lok Sabha presides over joint sittings.", explanation: "In Lok Sabha, quorum is 1/10th of the total members. Joint sitting is called under Article 108 when there is a deadlock." },
    { questionNumber: "2(ii)", answer: "Original Jurisdiction: Disputes between Centre and States, or between States themselves. Writ: Habeas Corpus / Mandamus / Prohibition / Certiorari / Quo Warranto.", explanation: "Under Article 131, the SC has original jurisdiction in federal disputes. Under Article 32, it can issue writs for enforcement of Fundamental Rights." },
    { questionNumber: "2(iii)", answer: "1. Destruction of Indian cottage industries due to British free-trade policy. 2. Drain of wealth from India to Britain through trade and taxation.", explanation: "British economic policies impoverished India by destroying local industries and extracting wealth through heavy taxation, land revenue, and one-sided trade." },
    { questionNumber: "2(iv)", answer: "Subhas Chandra Bose. He founded the Forward Bloc (1939) and reorganised the Indian National Army (INA/Azad Hind Fauj).", explanation: "Bose escaped from India in 1941, went to Germany and then Japan, and led the INA with the war cry 'Delhi Chalo'." },
    { questionNumber: "2(v)", answer: "The Simon Commission was boycotted because it had no Indian member — all members were British. Indians saw it as an insult.", explanation: "The Commission was appointed in 1927 under Sir John Simon to review constitutional reforms but had no Indian representation." },
    { questionNumber: "2(vi)", answer: "1. To maintain international peace and security. 2. To develop friendly relations among nations based on equality and self-determination.", explanation: "Other objectives include international cooperation and serving as a centre for harmonising actions of nations." },
    { questionNumber: "2(vii)", answer: "Appeasement was the policy of giving in to the demands of an aggressive nation to maintain peace. Britain and France followed this policy.", explanation: "Britain (under Chamberlain) and France appeased Hitler by allowing the annexation of Austria and Sudetenland, which only emboldened Nazi aggression." },

    // Section A: Civics
    { questionNumber: "3(i)", answer: "Rajya Sabha: Max 250 members (238 elected + 12 nominated). Elected by MLAs of State Assemblies using single transferable vote system.", explanation: "Members are elected indirectly by elected members of State Legislative Assemblies. 12 members are nominated by the President for contributions in literature, science, art, social service." },
    { questionNumber: "3(ii)", answer: "Adjournment Motion: To draw attention to an urgent matter of public importance, suspends normal business temporarily. No-Confidence Motion: Tests whether the government has the majority; if passed, the government must resign.", explanation: "Adjournment Motion is a censure but doesn't affect the government's continuity. No-Confidence Motion can lead to the fall of the government." },
    { questionNumber: "3(iii)", answer: "1. Approves annual budget. 2. No tax can be levied/collected without Parliament's approval. 3. Controls government expenditure through CAG reports. 4. Money Bills can only be introduced in Lok Sabha.", explanation: "Parliament has supreme control over public finances. The Consolidated Fund of India cannot be drawn without Parliament's approval." },
    { questionNumber: "4(i)", answer: "Qualifications: 1. Citizen of India. 2. Completed 35 years of age. 3. Qualified to be a member of Lok Sabha. 4. Must not hold any office of profit under Government.", explanation: "The President is elected by an electoral college consisting of elected members of both Houses of Parliament and State Assemblies." },
    { questionNumber: "4(ii)", answer: "1. Appoints PM and Council of Ministers. 2. Appoints Governors of States. 3. Appoints judges of Supreme Court and High Courts. Also Commander-in-Chief of armed forces.", explanation: "All executive actions of the Government are taken in the President's name." },
    { questionNumber: "4(iii)", answer: "Council of Ministers: Larger body with all three tiers (Cabinet, Ministers of State, Deputy Ministers). Cabinet: Inner core of senior ministers who make key policy decisions.", explanation: "The Cabinet meets regularly and decides major policy matters. The full Council of Ministers rarely meets as a whole." },
    { questionNumber: "5(i)", answer: "Appointed by the President in consultation with the Chief Justice of India and the Governor of the State. Independence: Fixed tenure — can only be removed by impeachment.", explanation: "Judges hold office until the age of 62. Their salaries and conditions are fixed and cannot be varied to their disadvantage during their term." },
    { questionNumber: "5(ii)", answer: "Judicial Review is the power of courts to review and declare laws/executive orders unconstitutional if they violate the Constitution. Importance: Protects fundamental rights and acts as guardian of the Constitution.", explanation: "It prevents legislative and executive overreach and ensures supremacy of the Constitution." },
    { questionNumber: "5(iii)", answer: "1. Speedy justice as cases are disposed of quickly. 2. No court fees involved, making justice affordable. 3. Decisions are binding with no appeal, ensuring finality. 4. Works on compromise and conciliation.", explanation: "Lok Adalats handle a wide range of cases and help reduce the burden on regular courts." },

    // Section B: History
    { questionNumber: "6(i)", answer: "Political causes: 1. Doctrine of Lapse (annexation of Satara, Jhansi, Nagpur). 2. Policy of annexation on pretext of misgovernment (e.g., Awadh). 3. Refusal to grant pensions to adopted sons (Nana Saheb). 4. Disrespect to Mughal Emperor.", explanation: "Lord Dalhousie's aggressive annexation policies alienated Indian rulers and created widespread political discontent." },
    { questionNumber: "6(ii)", answer: "The Enfield rifle cartridges were allegedly greased with cow and pig fat — offensive to both Hindu and Muslim soldiers who had to bite them open. This unified accumulated grievances into a massive uprising.", explanation: "The greased cartridges issue was the immediate trigger that turned existing political, economic, and social resentment into a full-scale rebellion." },
    { questionNumber: "6(iii)", answer: "The press spread ideas of liberty and democracy; created a platform to criticize British policies; formed public opinion and created national unity; helped Indians exchange views and become aware of common problems.", explanation: "Newspapers like 'Kesari', 'Amrit Bazar Patrika', 'The Hindu' played a crucial role in awakening national consciousness." },
    { questionNumber: "7(i)", answer: "Civil Disobedience Movement, 1930.", explanation: "Gandhi's Dandi March and breaking of the salt law on April 6, 1930, launched the Civil Disobedience Movement." },
    { questionNumber: "7(ii)", answer: "1. Rejection of the Simon Commission. 2. Declaration of Poorna Swaraj at the Lahore Session (1929). Also: economic hardship from the Great Depression.", explanation: "The failure of the British to grant dominion status and the economic crisis fueled the demand for complete independence." },
    { questionNumber: "7(iii)", answer: "1. Widespread participation from women, students, and peasants widened the freedom struggle. 2. Successful boycott of foreign goods and liquor hurt British economic interests. 3. Shook British administration's moral authority and led to the Gandhi-Irwin Pact.", explanation: "The movement also drew international attention to India's freedom struggle and demonstrated the power of non-violent resistance." },
    { questionNumber: "8(i)", answer: "1. To liberate India from British rule through armed force. 2. To form a national army based on equality and secularism, irrespective of religion, caste, or community.", explanation: "The INA was first formed by Mohan Singh in 1942 and later reorganised by Bose in 1943." },
    { questionNumber: "8(ii)", answer: "The Muslim League called Direct Action Day on August 16, 1946, to press its demand for Pakistan. It led to the 'Great Calcutta Killing' — widespread communal violence and thousands of deaths.", explanation: "Direct Action Day deepened the Hindu-Muslim divide and demonstrated the impossibility of a united India under the existing tensions." },
    { questionNumber: "8(iii)", answer: "1. Only solution to the escalating communal violence and threat of civil war. 2. Working with Muslim League in Interim Government proved impossible. 3. Smaller India with strong central authority was preferable. 4. Further delay could lead to greater chaos.", explanation: "The Congress leadership agreed to Partition as a pragmatic solution, even though it went against their original ideals." },
    { questionNumber: "9(i)", answer: "1. Treaty of Versailles created desire for revenge in Germany. 2. Rise of Fascism and Nazism with expansionist policies. 3. Failure of League of Nations. Also: Policy of Appeasement and Hitler's invasion of Poland.", explanation: "The combination of unresolved WWI grievances, aggressive dictatorships, and weak international institutions made WWII inevitable." },
    { questionNumber: "9(ii)", answer: "Both were totalitarian, anti-democratic, and believed in supreme authority of a single leader. Difference: Fascism focused on state supremacy; Nazism was based on racial ideology (Aryan supremacy) and anti-Semitism.", explanation: "While both promoted aggressive nationalism and militarism, Nazism's racial ideology made it uniquely destructive." },
    { questionNumber: "9(iii)", answer: "1. German, Austro-Hungarian, Ottoman, and Russian empires dissolved. 2. New nations (Poland, Czechoslovakia, Yugoslavia) created. 3. Europe economically devastated. 4. League of Nations formed. Also: Rise of USA as world power.", explanation: "WWI fundamentally redrew the map of Europe and created conditions that led to WWII." },
    { questionNumber: "10(i)", answer: "International Court of Justice (ICJ). Composition: 15 judges from different countries, elected by UN General Assembly and Security Council for 9-year terms.", explanation: "The ICJ is the principal judicial organ of the UN, located in The Hague, Netherlands." },
    { questionNumber: "10(ii)", answer: "1. Discusses matters of international peace and security. 2. Approves the UN budget. 3. Elects non-permanent members of the Security Council and other UN bodies. Also: Admits new members on Security Council's recommendation.", explanation: "The General Assembly is the main deliberative body where all member states have equal representation." },
    { questionNumber: "10(iii)", answer: "NAM: Forum of countries that did not align with either the US-led NATO or Soviet-led Communist bloc during the Cold War. Objectives: 1. Preserve national sovereignty. 2. Oppose colonialism and racial discrimination. Also: Promote world peace through Panchsheel.", explanation: "NAM was founded in 1961 at the Belgrade Conference by Nehru, Tito, and Nasser." },
  ]
};

// ==========================================
// PAPER 2 — MOCK SPECIMEN PAPER 02 (2026)
// ==========================================
export const historyCivicsPaper2: TYQPaper = {
  subject: "History & Civics",
  subjectId: "history-civics",
  paperNumber: 2,
  year: "2026",
  totalMarks: 80,
  sections: [
    {
      name: "Part I — Compulsory (30 Marks)",
      instructions: "Attempt all questions from this Part.",
      questions: [
        {
          number: "1",
          text: "Choose the correct answers to the questions from the given options.",
          marks: 16,
          subQuestions: [
            {
              number: "(i)",
              text: "Which of the following is a Fundamental Duty of an Indian citizen?",
              options: [
                "To vote in elections",
                "To protect the sovereignty, unity and integrity of India",
                "To own property",
                "To criticize the government"
              ],
              marks: 1
            },
            {
              number: "(ii)",
              text: "The Chief Election Commissioner of India can be removed from office only by:",
              options: [
                "The Prime Minister",
                "The President on his own",
                "Impeachment by Parliament similar to a judge of the Supreme Court",
                "A vote of no-confidence in the Lok Sabha"
              ],
              marks: 1
            },
            {
              number: "(iii)",
              text: "Identify the exclusive power of the Rajya Sabha:",
              options: [
                "To introduce Money Bills",
                "To pass a No-Confidence Motion",
                "To create new All India Services by passing a resolution",
                "To control the Union Budget"
              ],
              marks: 1
            },
            {
              number: "(iv)",
              text: "The maximum strength of the Lok Sabha as provided in the Constitution is:",
              options: ["545", "552", "250", "500"],
              marks: 1
            },
            {
              number: "(v)",
              text: "Assertion (A): The Vice-President of India is the ex-officio Chairman of the Rajya Sabha.\nReason (R): The Vice-President is elected by an electoral college consisting of members of both Houses of Parliament.",
              options: [
                "Both (A) and (R) are true, and (R) is the correct explanation of (A).",
                "Both (A) and (R) are true, but (R) is not the correct explanation of (A).",
                "(A) is true, but (R) is false.",
                "(A) is false, but (R) is true."
              ],
              marks: 1
            },
            {
              number: "(vi)",
              text: "The First War of Independence in 1857 began from:",
              options: ["Delhi", "Kanpur", "Meerut", "Lucknow"],
              marks: 1
            },
            {
              number: "(vii)",
              text: "Arrange the following in correct chronological order:\n1. Jallianwala Bagh Massacre\n2. Rowlatt Act\n3. Non-Cooperation Movement",
              options: ["1, 2, 3", "2, 1, 3", "3, 2, 1", "2, 3, 1"],
              marks: 1
            },
            {
              number: "(viii)",
              text: "Which of the following was NOT a cause of the Non-Cooperation Movement?",
              options: [
                "Khilafat issue",
                "Jallianwala Bagh massacre",
                "Arrival of Simon Commission",
                "Rowlatt Act"
              ],
              marks: 1
            },
            {
              number: "(ix)",
              text: "The Poona Pact of 1932 was signed between:",
              options: [
                "Gandhi and Ambedkar",
                "Gandhi and Jinnah",
                "Gandhi and Irwin",
                "Gandhi and Nehru"
              ],
              marks: 1
            },
            {
              number: "(x)",
              text: "The policy of 'Doctrine of Lapse' was introduced by:",
              options: [
                "Lord Warren Hastings",
                "Lord Cornwallis",
                "Lord Dalhousie",
                "Lord Curzon"
              ],
              marks: 1
            },
            {
              number: "(xi)",
              text: "The Tripitikas are important sources for the study of:",
              options: ["Jainism", "Buddhism", "Vedic period", "Mauryan Empire"],
              marks: 1
            },
            {
              number: "(xii)",
              text: "The United Nations Day is celebrated on:",
              options: ["October 24", "June 26", "December 10", "January 1"],
              marks: 1
            },
            {
              number: "(xiii)",
              text: "The main architect of the Quit India Movement was:",
              options: [
                "Jawaharlal Nehru",
                "Subhas Chandra Bose",
                "Mahatma Gandhi",
                "Sardar Patel"
              ],
              marks: 1
            },
            {
              number: "(xiv)",
              text: "Which UN agency is dedicated to educational, scientific and cultural development?",
              options: ["WHO", "UNICEF", "UNESCO", "ILO"],
              marks: 1
            },
            {
              number: "(xv)",
              text: "The Cripps Mission arrived in India in:",
              options: ["1942", "1946", "1939", "1945"],
              marks: 1
            },
            {
              number: "(xvi)",
              text: "The Panchsheel principles are associated with:",
              options: ["UNO", "NAM", "League of Nations", "SAARC"],
              marks: 1
            }
          ]
        },
        {
          number: "2",
          text: "",
          marks: 14,
          subQuestions: [
            {
              number: "(i)",
              text: "What is the meaning of 'Universal Adult Franchise'? Mention any one feature of the Indian Constitution that promotes secularism.",
              marks: 2
            },
            {
              number: "(ii)",
              text: "Distinguish between a 'General Election' and a 'By-election'.",
              marks: 2
            },
            {
              number: "(iii)",
              text: "Mention any two consequences of the Revolt of 1857 on the British administration in India.",
              marks: 2
            },
            {
              number: "(iv)",
              text: "Name the two main sources that tell us about the Mauryan Empire.",
              marks: 2
            },
            {
              number: "(v)",
              text: "Why did Mahatma Gandhi call off the Non-Cooperation Movement?",
              marks: 2
            },
            {
              number: "(vi)",
              text: "What is the full form of WHO and ILO?",
              marks: 2
            },
            {
              number: "(vii)",
              text: "Mention any two clauses of the Cabinet Mission Plan.",
              marks: 2
            }
          ]
        }
      ]
    },
    {
      name: "Part II — Section A: Civics (Attempt any TWO)",
      instructions: "Attempt any two questions from this Section.",
      questions: [
        {
          number: "3",
          text: "The Union Legislature",
          marks: 10,
          subQuestions: [
            {
              number: "(i)",
              text: "Explain the composition of the Lok Sabha. How are its members elected?",
              marks: 3
            },
            {
              number: "(ii)",
              text: "Describe any three powers of the Speaker of the Lok Sabha.",
              marks: 3
            },
            {
              number: "(iii)",
              text: "What is a 'No-Confidence Motion'? Explain its significance in a parliamentary democracy.",
              marks: 4
            }
          ]
        },
        {
          number: "4",
          text: "The Union Executive",
          marks: 10,
          subQuestions: [
            {
              number: "(i)",
              text: "Mention any three powers of the President as the head of the judiciary.",
              marks: 3
            },
            {
              number: "(ii)",
              text: "Explain the discretionary powers of the President.",
              marks: 3
            },
            {
              number: "(iii)",
              text: "What is the collective and individual responsibility of the Council of Ministers?",
              marks: 4
            }
          ]
        },
        {
          number: "5",
          text: "The Judiciary",
          marks: 10,
          subQuestions: [
            {
              number: "(i)",
              text: "What is the composition of the Supreme Court of India?",
              marks: 3
            },
            {
              number: "(ii)",
              text: "Explain the term 'Judicial Review'. Why is it important?",
              marks: 3
            },
            {
              number: "(iii)",
              text: "Differentiate between a Court of the District Judge and a Sessions Court.",
              marks: 4
            }
          ]
        }
      ]
    },
    {
      name: "Part II — Section B: History (Attempt any THREE)",
      instructions: "Attempt any three questions from this Section.",
      questions: [
        {
          number: "6",
          text: "The Indian National Movement (1857-1917)",
          marks: 10,
          subQuestions: [
            {
              number: "(i)",
              text: "Mention any three economic factors that led to the growth of nationalism in India.",
              marks: 3
            },
            {
              number: "(ii)",
              text: "What were the objectives of the Early Nationalists? Mention any two contributions of Dadabhai Naoroji.",
              marks: 3
            },
            {
              number: "(iii)",
              text: "Explain the significance of the Partition of Bengal (1905) in the history of Indian nationalism.",
              marks: 4
            }
          ]
        },
        {
          number: "7",
          text: "The Gandhian Era",
          marks: 10,
          subQuestions: [
            {
              number: "(i)",
              text: "Name the movement launched by Gandhi in 1919 against the Rowlatt Act. What was its significance?",
              marks: 2
            },
            {
              number: "(ii)",
              text: "State any two causes of the Quit India Movement (1942).",
              marks: 2
            },
            {
              number: "(iii)",
              text: "Analyse any three impacts of the Non-Cooperation Movement on the Indian society and politics.",
              marks: 6
            }
          ]
        },
        {
          number: "8",
          text: "The Muslim League and Road to Independence",
          marks: 10,
          subQuestions: [
            {
              number: "(i)",
              text: "When was the Muslim League founded? Mention its original objective.",
              marks: 2
            },
            {
              number: "(ii)",
              text: "What was the significance of the Lahore Session of the Muslim League in 1940?",
              marks: 2
            },
            {
              number: "(iii)",
              text: "Explain any four reasons for the acceptance of the Indian Independence Act of 1947 by the Congress.",
              marks: 6
            }
          ]
        },
        {
          number: "9",
          text: "The Contemporary World",
          marks: 10,
          subQuestions: [
            {
              number: "(i)",
              text: "Mention any three causes of the First World War.",
              marks: 3
            },
            {
              number: "(ii)",
              text: "State any three consequences of the Treaty of Versailles.",
              marks: 3
            },
            {
              number: "(iii)",
              text: "Explain any two similarities between Fascism and Nazism.",
              marks: 4
            }
          ]
        },
        {
          number: "10",
          text: "The United Nations and NAM",
          marks: 10,
          subQuestions: [
            {
              number: "(i)",
              text: "What are the main objectives of the United Nations?",
              marks: 3
            },
            {
              number: "(ii)",
              text: "Mention any three functions of the Security Council.",
              marks: 3
            },
            {
              number: "(iii)",
              text: "Explain the role of Jawaharlal Nehru in the formation of the Non-Aligned Movement.",
              marks: 4
            }
          ]
        }
      ]
    }
  ]
};

// ==========================================
// PAPER 2 — ANSWER KEY
// ==========================================
export const historyCivicsPaper2Answers: TYQAnswerKey = {
  subject: "History & Civics",
  subjectId: "history-civics",
  paperNumber: 2,
  answers: [
    // Question 1 MCQs
    { questionNumber: "1(i)", answer: "(b) To protect the sovereignty, unity and integrity of India", explanation: "This is one of the Fundamental Duties listed under Article 51A of the Indian Constitution." },
    { questionNumber: "1(ii)", answer: "(c) Impeachment by Parliament similar to a judge of the Supreme Court", explanation: "The CEC can only be removed through a process similar to the removal of a Supreme Court judge — by an order of the President after an address by Parliament." },
    { questionNumber: "1(iii)", answer: "(c) To create new All India Services by passing a resolution", explanation: "Under Article 312, only the Rajya Sabha can pass a resolution to create new All India Services in the national interest." },
    { questionNumber: "1(iv)", answer: "(b) 552", explanation: "Max 530 from States + 20 from UTs + 2 nominated Anglo-Indians (provision now lapsed) = 552." },
    { questionNumber: "1(v)", answer: "(b) Both (A) and (R) are true, but (R) is not the correct explanation of (A).", explanation: "The VP being Chairman of Rajya Sabha is a constitutional provision (Art. 64), not because of how the VP is elected." },
    { questionNumber: "1(vi)", answer: "(c) Meerut", explanation: "The Revolt of 1857 began on May 10, 1857 in Meerut, where Indian sepoys refused to use the greased cartridges." },
    { questionNumber: "1(vii)", answer: "(b) 2, 1, 3", explanation: "Rowlatt Act (March 1919), Jallianwala Bagh Massacre (April 1919), Non-Cooperation Movement (1920-22)." },
    { questionNumber: "1(viii)", answer: "(c) Arrival of Simon Commission", explanation: "The Simon Commission arrived in 1928, after the Non-Cooperation Movement (1920-22). The NCM was caused by the Khilafat issue, Jallianwala Bagh, and Rowlatt Act." },
    { questionNumber: "1(ix)", answer: "(a) Gandhi and Ambedkar", explanation: "The Poona Pact (1932) was signed between Mahatma Gandhi and Dr. B.R. Ambedkar regarding the representation of depressed classes." },
    { questionNumber: "1(x)", answer: "(c) Lord Dalhousie", explanation: "Lord Dalhousie (Governor-General 1848-56) introduced the Doctrine of Lapse to annex Indian states without natural heirs." },
    { questionNumber: "1(xi)", answer: "(b) Buddhism", explanation: "The Tripitikas (Vinaya Pitaka, Sutta Pitaka, Abhidhamma Pitaka) are the sacred texts of Buddhism." },
    { questionNumber: "1(xii)", answer: "(a) October 24", explanation: "United Nations Day is celebrated on October 24, the anniversary of the UN Charter coming into force in 1945." },
    { questionNumber: "1(xiii)", answer: "(c) Mahatma Gandhi", explanation: "Gandhi launched the Quit India Movement on August 8, 1942, with the famous call 'Do or Die'." },
    { questionNumber: "1(xiv)", answer: "(c) UNESCO", explanation: "UNESCO (United Nations Educational, Scientific and Cultural Organization) works for international collaboration in education, science, and culture." },
    { questionNumber: "1(xv)", answer: "(a) 1942", explanation: "The Cripps Mission came to India in March 1942, during WWII, with proposals for Indian self-governance after the war." },
    { questionNumber: "1(xvi)", answer: "(b) NAM", explanation: "The Panchsheel (Five Principles of Peaceful Coexistence) are closely associated with the Non-Aligned Movement and India-China relations." },

    // Question 2 Short Answers
    { questionNumber: "2(i)", answer: "Universal Adult Franchise: Right to vote given to all adult citizens (18+ years) without discrimination. Secularism: No official religion / equal respect for all religions.", explanation: "India adopted universal adult franchise from its first election, making it the world's largest democracy." },
    { questionNumber: "2(ii)", answer: "General Election: Held simultaneously for all constituencies after the House's term expires. By-election: Held for a single constituency due to death/resignation of a member.", explanation: "General elections are held every 5 years; by-elections can be held at any time." },
    { questionNumber: "2(iii)", answer: "1. End of East India Company's rule; India came under direct British Crown. 2. Reorganisation of the army to reduce proportion of Indian soldiers.", explanation: "The Queen's Proclamation of 1858 transferred power from the Company to the Crown." },
    { questionNumber: "2(iv)", answer: "Arthashastra (by Kautilya) and Indika (by Megasthenes). Also: Ashokan Edicts.", explanation: "These are the primary literary and archaeological sources for studying the Mauryan period." },
    { questionNumber: "2(v)", answer: "Gandhi called off the Non-Cooperation Movement due to the Chauri Chaura incident (1922), where a violent mob set fire to a police station, killing policemen.", explanation: "Gandhi believed in non-violence and suspended the movement immediately after the violence." },
    { questionNumber: "2(vi)", answer: "WHO: World Health Organization. ILO: International Labour Organization.", explanation: "Both are specialized agencies of the United Nations." },
    { questionNumber: "2(vii)", answer: "1. Rejection of the demand for Pakistan. 2. Proposed a federal union with provincial autonomy. Also: Formation of an Interim Government.", explanation: "The Cabinet Mission came to India in 1946 to discuss the transfer of power." },

    // Section A: Civics
    { questionNumber: "3(i)", answer: "Lok Sabha: Max 552 members (530 from states, 20 from UTs, 2 nominated). Members are directly elected by the people from territorial constituencies through universal adult franchise.", explanation: "The Lok Sabha is the lower house of Parliament and represents the people directly." },
    { questionNumber: "3(ii)", answer: "Speaker's powers: 1. Maintains discipline and order. 2. Adjourns the House. 3. Presides over joint sittings. Also: Final authority on disqualification under Anti-Defection Law.", explanation: "The Speaker is the most important officer of the Lok Sabha and is impartial in exercise of duties." },
    { questionNumber: "3(iii)", answer: "No-Confidence Motion: Moved only in Lok Sabha to test the government's majority. If passed, the government must resign. Significance: Ensures executive accountability to the legislature.", explanation: "It is a powerful tool of parliamentary democracy to hold the government accountable." },
    { questionNumber: "4(i)", answer: "Judicial powers: 1. Appoints judges of SC and HCs. 2. Can grant pardons, reprieves, respites or remissions of punishment. 3. Not answerable to any court for exercise of powers.", explanation: "The President's judicial powers ensure the independence of the judiciary and provide a check on the judicial system." },
    { questionNumber: "4(ii)", answer: "Discretionary powers: 1. Appoints PM when no party has clear majority. 2. Can withhold assent to bills. 3. Can dismiss a government that loses majority but refuses to resign. 4. Can dissolve Lok Sabha.", explanation: "These are situations where the President can act without the advice of the Council of Ministers." },
    { questionNumber: "4(iii)", answer: "Collective responsibility: Council of Ministers is collectively responsible to Lok Sabha — they sink or swim together. Individual responsibility: Ministers hold office during the President's pleasure and are individually responsible for their department.", explanation: "Article 75 establishes both collective and individual responsibility." },
    { questionNumber: "5(i)", answer: "Supreme Court: 1 Chief Justice + 33 other judges (total 34). Appointed by the President.", explanation: "The number of judges has been increased over time; originally it was 1 CJI + 7 judges." },
    { questionNumber: "5(ii)", answer: "Judicial Review: Power to declare a law unconstitutional if it violates the Constitution. Importance: Guardian of the Constitution, protects Fundamental Rights from legislative and executive overreach.", explanation: "Judicial review ensures the supremacy of the Constitution." },
    { questionNumber: "5(iii)", answer: "District Judge: Deals with civil cases at district level. Sessions Judge: Deals with criminal cases at district level. Both are at the same level but handle different types of cases.", explanation: "The same person can serve as both District Judge and Sessions Judge in some jurisdictions." },

    // Section B: History
    { questionNumber: "6(i)", answer: "Economic factors: 1. Drain of wealth from India to Britain. 2. Destruction of Indian cottage industries. 3. Heavy taxation on Indians. Also: Exploitation by British merchants.", explanation: "British economic policies systematically impoverished India and enriched Britain." },
    { questionNumber: "6(ii)", answer: "Early Nationalist objectives: Constitutional, administrative, and economic reforms through petitions and appeals. Dadabhai Naoroji: Exposed drain of wealth theory; first Indian MP in British Parliament; authored 'Poverty and Un-British Rule in India'.", explanation: "The Early Nationalists believed in constitutional methods and had faith in British justice." },
    { questionNumber: "6(iii)", answer: "Partition of Bengal (1905): Led to Swadeshi movement; boycott of British goods; growth of assertive nationalism; temporarily united Hindus and Muslims against the British.", explanation: "Lord Curzon's partition of Bengal was meant to weaken the nationalist movement but ended up strengthening it." },
    { questionNumber: "7(i)", answer: "Rowlatt Satyagraha (1919). Significance: First mass movement under Gandhi's leadership; led to the Jallianwala Bagh massacre.", explanation: "The Rowlatt Act allowed preventive detention without trial, sparking widespread protests." },
    { questionNumber: "7(ii)", answer: "Quit India causes: 1. Failure of Cripps Mission. 2. Japanese threat and wartime hardships. Also: Demand for immediate freedom.", explanation: "The movement reflected growing impatience with British rule during WWII." },
    { questionNumber: "7(iii)", answer: "NCM impacts: 1. Mass participation from all sections of society. 2. Boycott of educational institutions and courts. 3. Decline of British prestige. 4. Hindu-Muslim unity initially. 5. Chauri Chaura led to suspension.", explanation: "The Non-Cooperation Movement transformed the freedom struggle from an elite to a mass movement." },
    { questionNumber: "8(i)", answer: "Muslim League founded: 1906 (at Dacca). Original objective: To protect and advance the political interests of Muslims and maintain loyalty to the British.", explanation: "The League was founded by Aga Khan and Nawab Salimullah Khan." },
    { questionNumber: "8(ii)", answer: "Lahore Session (1940): Passed the 'Pakistan Resolution' demanding a separate Muslim state in Muslim-majority areas of north-west and eastern India.", explanation: "This marked the official demand for Pakistan, drafted by Muhammad Ali Jinnah." },
    { questionNumber: "8(iii)", answer: "Reasons for accepting Independence Act: 1. Only solution to communal problem. 2. League's obstruction made joint governance impossible. 3. To avoid civil war. 4. Immediate transfer of power was essential. Also: Fear of greater chaos.", explanation: "The Congress accepted Partition reluctantly as the only viable option for peace." },
    { questionNumber: "9(i)", answer: "WWI causes: 1. Aggressive nationalism. 2. Imperialism and colonial rivalry. 3. Arms race. Also: Alliance system and assassination of Archduke Franz Ferdinand (Sarajevo crisis).", explanation: "The combination of these factors created a powder keg that was ignited by the Sarajevo assassination." },
    { questionNumber: "9(ii)", answer: "Treaty of Versailles: 1. Germany lost all colonies. 2. War Guilt Clause (Article 231). 3. Huge reparations imposed. Also: Demilitarization of Rhineland.", explanation: "The harsh terms created deep resentment in Germany and contributed to the rise of Hitler." },
    { questionNumber: "9(iii)", answer: "Fascism & Nazism similarities: 1. Both totalitarian with one-party rule. 2. Both glorified war and were anti-democratic. 3. Both suppressed opposition and used propaganda. 4. Both promoted aggressive nationalism.", explanation: "While similar in methods, Nazism's racial ideology distinguished it from Italian Fascism." },
    { questionNumber: "10(i)", answer: "UN objectives: 1. Maintain international peace and security. 2. Develop friendly relations among nations. 3. International cooperation for solving economic, social, and humanitarian problems. 4. Promote human rights.", explanation: "These objectives are outlined in Article 1 of the UN Charter." },
    { questionNumber: "10(ii)", answer: "Security Council functions: 1. Maintain peace and security. 2. Investigate disputes. 3. Impose sanctions on aggressor nations. Also: Authorize military action.", explanation: "The Security Council has 5 permanent members with veto power and 10 non-permanent members." },
    { questionNumber: "10(iii)", answer: "Nehru's role in NAM: One of the founding fathers; advocated Panchsheel (Five Principles of Peaceful Coexistence); kept India non-aligned during Cold War; worked for Afro-Asian unity at Bandung Conference.", explanation: "Nehru's vision of non-alignment shaped India's foreign policy for decades." },
  ]
};

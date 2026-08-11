--
-- PostgreSQL database dump
--


-- Dumped from database version 17.10 (4f20678)
-- Dumped by pg_dump version 17.10 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: Member; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Member" (id, name, email, role, "position", interests, "imgPath", year, degree, "currentPosition", education, "workHistory", "lectureSubjects", published, "order", "createdAt", "updatedAt", "researchFields") FROM stdin;
cmpe74j4c000ngzx10b4eyg66	Hyunmuk Lim	hyunmuklim@hdec.co.kr	ALUMNI	Doctoral degree	{}	/legacy/14_copy1_17_0f3ba66eb9d874349e0f3e4eb0b6cc8b_LPHE6xZI_c1c47495b381a5e7ac7ca44cd33269a607afcb8d.jpg	2022	Doctoral degree	Hyundai Engineering & Construction Technology Research Institute	\N	\N	\N	t	18	2026-05-20 15:07:43.692	2026-06-11 14:21:26.017	\N
cmpe74j3l0003gzx1yoev3819	Jung Chan Moc	blax1004@ajou.ac.kr	STUDENT	Ph.D. Course	{"TGP (Thermal Ground Plane)","Loop heat pipe"}	/legacy/d11659f8c32158d2dc7b8f2e2c5f1d67_nBdIZP4H_23241f587a30fb23bfab5c8b30b4556b957449e8.jpg	'23	\N	\N	\N	\N	\N	t	10	2026-05-20 15:07:43.665	2026-05-20 15:07:43.665	\N
cmpe74j3o0004gzx1i329kbyo	Junyoung Choi	kbq06247@ajou.ac.kr	STUDENT	Ph.D. Course	{"Pool boiling","TGP (Thermal Ground Plane)","Surface enhancement"}	/legacy/c153cb953644731e198e00420b95da9a_VPJjor23_31e318e1e14e2b0c8711dfad3ba1c2bf15b6a6a2.png	'23	\N	\N	\N	\N	\N	t	13	2026-05-20 15:07:43.668	2026-05-20 15:07:43.668	\N
cmpe74j43000ggzx1me27g5xa	Seokjin Lee	tjrwls0422@ajou.ac.kr	ALUMNI	Master's degree	{}	/legacy/48cde7be0dc744a4c1fa125f1d61fe2b_kM2qeSEG_6db43d2a8cf6e787b9977e879dcd13e7611e1ab2.png	2024	Master's degree	LIG Nex1	\N	\N	\N	t	3	2026-05-20 15:07:43.683	2026-05-20 15:07:43.683	\N
cmpe74j46000igzx1c7gb1jrf	Kyuil Kim	ooilkij@ajou.ac.kr	ALUMNI	Master's degree	{}	/legacy/1_copy1_6_a85600f146438a9a873aabd3266d4871_LORDTAk0_a7aa8a83197aa5f4821d42d5957bca471e1c6273.jpg	2024	Master's degree	Hyundai Motor Company	\N	\N	\N	t	6	2026-05-20 15:07:43.686	2026-05-20 15:07:43.686	\N
cmpe74j47000jgzx1ui30thrq	Sanghyeon Shin	tls6320@ajou.ac.kr	ALUMNI	Master's degree	{}	/legacy/0f3ba66eb9d874349e0f3e4eb0b6cc8b_60bZv5Ir_b66e6081c55e79d903101d790475cd518f76a5e3.png	2025	Master's degree	LIG Nex1	\N	\N	\N	t	7	2026-05-20 15:07:43.687	2026-05-20 15:07:43.687	\N
cmpe74j48000kgzx1w4thy5ji	Seung Woo Choi	csw991004@ajou.ac.kr	ALUMNI	Master's degree	{}	/legacy/0f3ba66eb9d874349e0f3e4eb0b6cc8b_SvcAQMwD_fdbbdab717b290bd28e8a96825c6bbe13271d5ea.png	2025	Master's degree	Hyundai Mobis	\N	\N	\N	t	8	2026-05-20 15:07:43.688	2026-05-20 15:07:43.688	\N
cmpe74j4a000lgzx1dxx3x9c4	ByungChan Hyun	skc2409@naver.com	ALUMNI	Master's degree	{}	/legacy/0f3ba66eb9d874349e0f3e4eb0b6cc8b_Wr2R3oCi_4c16de32c1d99f98b65d735c8ee62b1a4473661f.jpg	2025	Master's degree	\N	\N	\N	\N	t	10	2026-05-20 15:07:43.69	2026-05-20 15:07:43.69	\N
cmpe74j3p0005gzx1mb2y8ha5	Seok Chan Hwang	swa10@ajou.ac.kr	STUDENT	Master's Course	{"DTC (Direct to Chip) cooling","Cold plate"}	/legacy/0f3ba66eb9d874349e0f3e4eb0b6cc8b_QUYLCBah_2de00b9855112f0af2d664cf53c767999e766dcc.jpg	'24	\N	\N	\N	\N	\N	t	18	2026-05-20 15:07:43.669	2026-06-11 14:26:15.557	\N
cmpe74j3r0006gzx1zx95oohi	Gangmin Geum	ahsjdk388@ajou.ac.kr	STUDENT	Master's Course	{"Loop thermosyphon cooling system in data center"}	/legacy/0f3ba66eb9d874349e0f3e4eb0b6cc8b_C0acop7h_266bde04930593642f51b09660e572115b89a5d9.jpg	'25	\N	\N	\N	\N	\N	t	19	2026-05-20 15:07:43.671	2026-06-11 14:26:15.557	\N
cmpe74j42000fgzx19p33f83j	Sukkyung Kang	skang@kmou.ac.kr	ALUMNI	Doctoral degree	{}	/legacy/0f3ba66eb9d874349e0f3e4eb0b6cc8b_bcQmtWno_9f1367a91a40894256078f864b1513b474b21008.jpg	2024	Doctoral degree	Division of Mechanical Engineering, Korea Maritime and Ocean University (Assistant Professor)	\N	\N	\N	t	2	2026-05-20 15:07:43.682	2026-06-11 14:21:26.017	\N
cmpe74j44000hgzx1x9p2qc4q	JinHyeuk Seo	joshep@ajou.ac.kr	ALUMNI	Doctoral degree	{}	/legacy/0f3ba66eb9d874349e0f3e4eb0b6cc8b_kPhBvDOb_06d0dd872151b9f46ddf61c798ea1a09784a48a9.png	2024	Doctoral degree	Hanwha Aerospace	\N	\N	\N	t	4	2026-05-20 15:07:43.684	2026-06-11 14:21:26.017	\N
cmpe74j4b000mgzx1sncuygpb	Su-Yoon Doh	suyoon2002@ajou.ac.kr	ALUMNI	Doctoral degree	{}	/legacy/0f3ba66eb9d874349e0f3e4eb0b6cc8b_3S04CH7D_a8d1dbaa16431849e04dd2ed486f754783742525.jpg	2026	Doctoral degree	Post Doctor on ATML, Ajou University.	\N	\N	\N	t	13	2026-05-20 15:07:43.691	2026-06-11 14:21:26.017	\N
cmpe74j3t0007gzx1mp7q7ybv	Seonmin Park	tjsals0000@ajou.ac.kr	STUDENT	Master's Course	{"Single-phase immersion cooling"}	/legacy/0f3ba66eb9d874349e0f3e4eb0b6cc8b_Z371goFD_db5ef635a48e28c1c3655732504c5d7b5e0ecf26.jpg	'25	\N	\N	\N	\N	\N	t	20	2026-05-20 15:07:43.673	2026-06-11 14:26:15.557	\N
cmpe74j40000egzx1gld9gknp	Jongho Park	zhfqlq@ajou.ac.kr	STUDENT	Master's Course	{"Pool boiling"}	/legacy/0f3ba66eb9d874349e0f3e4eb0b6cc8b_jVlU9AOu_b73bee78dd6a4286c35252616bac8f8709173b27.jpg	'26	\N	\N	\N	\N	\N	t	22	2026-05-20 15:07:43.68	2026-07-13 15:33:00.114	\N
cmpe74j3v0009gzx1et25k2ct	Jaehyun An	dkswogus1027@ajou.ac.kr	STUDENT	Undergraduate Intern	{}	/legacy/0f3ba66eb9d874349e0f3e4eb0b6cc8b_N6aYSf5h_09d5a8fb951473b2a896e8107ef5b09a93bed251.png	'25	\N	\N	\N	\N	\N	t	25	2026-05-20 15:07:43.675	2026-07-13 15:32:55.61	\N
cmpe74j3y000bgzx1rj6wdpfg	Seunggeon Kim	ksg2002@ajou.ac.kr	STUDENT	Master's Course	{"Geothermal heat pipe"}	/legacy/0f3ba66eb9d874349e0f3e4eb0b6cc8b_JNYhaw4R_48b98a830cc22b6dc7ab33c572d0d5468cc2e814.jpg	'25	\N	\N	\N	\N	\N	t	23	2026-05-20 15:07:43.678	2026-07-13 15:33:00.118	\N
cmpe74j3i0002gzx1baa9dhz1	Su-Yoon Doh	suyoon2002@ajou.ac.kr	RESEARCHER	Postdoctoral Researcher	{"Boiling-driven heat spreader"}	/legacy/0f3ba66eb9d874349e0f3e4eb0b6cc8b_3S04CH7D_a8d1dbaa16431849e04dd2ed486f754783742525.jpg	\N	\N	\N	\N	\N	\N	t	27	2026-05-20 15:07:43.662	2026-07-13 15:30:58.079	\N
cmpe74j3z000dgzx1ycvtxtez	Donghoon Kim	kum2475@ajou.ac.kr	STUDENT	Undergraduate Intern	{}	/legacy/0f3ba66eb9d874349e0f3e4eb0b6cc8b_H0Sm2PRY_376ddea03e074307874a9a296b19e5d3ec4bbffb.jpg	'25	\N	\N	\N	\N	\N	t	29	2026-05-20 15:07:43.679	2026-07-13 15:32:52.103	\N
cmpe74j3y000cgzx1ixi5k7ug	Hongsik Nho	plantbig0937@ajou.ac.kr	STUDENT	Undergraduate Intern	{}	/legacy/0f3ba66eb9d874349e0f3e4eb0b6cc8b_G8k0XHDa_d4257a60eb4ae50d2c74df5e244a50e488b41ec2.jpg	'25	\N	\N	\N	\N	\N	t	27	2026-05-20 15:07:43.678	2026-07-13 15:32:53.184	\N
cmpe74j3w000agzx1b26o7715	Insoo Yoon	ins1@ajou.ac.kr	STUDENT	Undergraduate Intern	{}	/legacy/0f3ba66eb9d874349e0f3e4eb0b6cc8b_ilCkU6XA_f10109880e5b4f2a1386b2ee6aea77a382140c2c.jpg	'25	\N	\N	\N	\N	\N	t	26	2026-05-20 15:07:43.676	2026-07-13 15:32:54.588	\N
cmpe74j3u0008gzx1nunextvh	Hyeonwoo Choi	gusdn4494@ajou.ac.kr	STUDENT	Undergraduate Intern	{}	/legacy/0f3ba66eb9d874349e0f3e4eb0b6cc8b_4njPRWBa_42a896b657824b8bef11d5ff3e69c1ded07f0e57.jpg	'25	\N	\N	\N	\N	\N	t	24	2026-05-20 15:07:43.674	2026-07-13 15:32:56.755	\N
cmpe74j3h0001gzx1luifieff	Woolim Chae	wooolim@ajou.ac.kr	RESEARCHER	Research Staff	{}	/legacy/0f3ba66eb9d874349e0f3e4eb0b6cc8b_tXsK83US_3a613212d13774342b68e3403e03f699af2f47ad.jpg	\N	\N	\N	\N	\N	\N	t	28	2026-05-20 15:07:43.661	2026-06-24 10:41:34.822	\N
cmpe74j390000gzx1cuk8wyur	Jungho Lee	jungholee@ajou.ac.kr	PROFESSOR	Professor	{}	/legacy/2396054e8ca6fa1354bbc0d8b478d120_aq7cBEsy_693bea3e035e02ac9dfff514faa9f8a21550d59c.jpg	\N	\N	\N	[{"inst": "Pohang University of Science and Technology (POSTECH)", "title": "Ph.D.", "period": "1994.03 ~ 1999.02"}, {"inst": "Pohang University of Science and Technology (POSTECH)", "title": "M.S.", "period": "1992.03 ~ 1994.02"}, {"inst": "Pusan National University", "title": "B.S.", "period": "1988.03 ~ 1992.02"}]	[{"inst": "Department of Mechanical Engineering, Ajou University", "title": "Professor", "period": "2021.03 ~ Present"}, {"inst": "Korea Institute of Machinery and Materials (KIMM)", "title": "Principal Researcher", "period": "2006.08 ~ 2021.02"}, {"inst": "Paris Agreement Research and Development Center, Korea Institute of Machinery and Materials (KIMM)", "title": "Director", "period": "2017.05 ~ 2018.05"}, {"inst": "Department of Research Strategy, Korea Institute of Machinery and Materials (KIMM)", "title": "Head", "period": "2012.09 ~ 2014.03"}, {"inst": "University of Oxford", "title": "Visiting Scholar", "period": "2012.06 ~ 2012.08"}, {"inst": "Department of Plant System and Machinery, University of Science and Technology (UST)", "title": "Professor", "period": "2011.09 ~ 2018.02"}, {"inst": "Pohang Iron & Steel Company (POSCO)", "title": "Senior Researcher", "period": "2004.08 ~ 2006.07"}, {"inst": "Samsung Corning Precision Glass", "title": "Senior Researcher", "period": "2002.06 ~ 2004.07"}, {"inst": "Department of Mechanical Engineering, University of Maryland at College Park, MD, USA", "title": "Postdoctoral Researcher", "period": "1999.08 ~ 2002.04"}, {"inst": "Advanced Fluids Engineering Research Center, POSTECH", "title": "Postdoctoral Researcher", "period": "1999.03 ~ 1999.07"}, {"inst": "Asian Union of Thermal Science and Engineering (AUTSE)", "title": "Executive Board Member", "period": "2020.05~Current"}, {"inst": "Asian Union of Thermal Science and Engineering (AUTSE)", "title": "Secretary General", "period": "2023.10~Current"}, {"inst": "Asian Union of Thermal Science and Engineering (AUTSE)", "title": "Fellow", "period": "2025.05~Current"}, {"inst": "International Centre for Heat and Mass Transfer (ICHMT)", "title": "Scientific Council Member", "period": "2023.01~Current"}, {"inst": "Korean Society of Fluid Machinery (KSFM), Korea", "title": "President", "period": "2026.01~2026.12"}, {"inst": "Electronics Equipment Cooling and Thermal Management Division, Korean Society of Fluid Machinery (KSFM), Korea", "title": "President", "period": "2023.01~2024.12"}, {"inst": "Thermal Engineering Division (TED), Korean Society of Mechanical Engineers (KSME), Korea", "title": "President", "period": "2024.01~2024.12"}, {"inst": "", "title": "Lifetime Member of KSME and KSFM", "period": ""}, {"inst": "", "title": "Member of ASME, ASM, SPE, ISIJ, and IEEE", "period": ""}]	[{"code": "", "title": "Heat Transfer"}, {"code": "", "title": "Applied Heat Transfer"}, {"code": "", "title": "Phase-Change Heat Transfer"}, {"code": "", "title": "Experimental Thermal and Fluid Engineering"}, {"code": "", "title": "Advanced Thermal Management"}]	t	1	2026-05-20 15:07:43.653	2026-06-25 12:53:45.297	[{"group": "Major R&D Areas", "items": [{"subs": ["High-Power Electronic Equipment", "Power Semiconductor", "Electric Vehicle (EV) Battery", "ESS Battery", "Laser-Diode", "Data Center Cooling"], "label": "Advanced Thermal Management"}, {"subs": ["TGP-embedded Heat Sink", "Liquid/Hybrid Cooling", "Phase-change Cooling"], "label": "Thermal Management Technology for Defense"}, {"subs": [], "label": "Heat Pipe Heat Exchanger (HPHX) for recovering waste heat"}, {"subs": [], "label": "Wrap-around heat pipe heat exchanger for air conditioning"}, {"subs": [], "label": "Phase-change Heat Transfer (Boiling and Condensation)"}, {"subs": [], "label": "Forced Convection Heat Transfer Enhancement (Jet and Spray)"}, {"subs": [], "label": "Direct liquid cooling for high-density data centers"}, {"subs": [], "label": "Heat Pipe, Vapor Chamber, and Thermal Ground Plane (TGP)"}, {"subs": [], "label": "Heat Pipe Heat Exchanger (HPHX)"}]}, {"group": "Commercial Product Technology Development", "items": [{"subs": [], "label": "Eco-Friendly Ultra Intensive Quenching"}, {"subs": [], "label": "Cooling Devices for Hot Steel Products"}]}]
\.


--
-- Data for Name: Publication; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Publication" (id, type, year, title, authors, journal, doi, conference, inventors, "applicationNo", country, "registeredAt", published, "order", "createdAt", "updatedAt", "imgPath") FROM stdin;
cmpe74j4q000ygzx1x6a4qnzc	JOURNAL	2021	Modeling and optimization of hydrophobic surfaces for a two-phase closed thermosyphon	Seo D., Kim Y., Seo J.H., Shin D.H., Nam Y., Lee J.	International Journal of Heat and Mass Transfer	https://doi.org/10.1016/j.ijheatmasstransfer.2020.120680	\N	\N	\N	\N	\N	t	17	2026-05-20 15:07:43.706	2026-06-01 08:28:37.092	/legacy/thumb-cc61d2e4480b7334f13976d067e6f56f_gNXGltBK_c8ba78b1e1d84096d4eadf73c3ff00b53b0257b1_202x150.jpg
cmpe74j4s0010gzx1ndrlhpif	JOURNAL	2021	Boiling-driven, wickless, and orientation-independent thermal ground plane	Moon J.H., Fadda D., Shin D.H., Kim J.S., Lee J., You S.M.	International Journal of Heat and Mass Transfer	https://doi.org/10.1016/j.ijheatmasstransfer.2020.120817	\N	\N	\N	\N	\N	t	19	2026-05-20 15:07:43.708	2026-06-01 08:28:37.19	/legacy/thumb-cc61d2e4480b7334f13976d067e6f56f_5LMueYKo_b6dcae3fc6e8dcb706c5cb3a14ed9af3903f891d_202x150.jpg
cmpe74j4t0011gzx1ubp1ng1f	JOURNAL	2021	Heat transfer and flow visualization of a two-phase closed thermosiphon using water, acetone, and HFE7100	Kim J.S., Kim Y., Shin D.H., You S.M., Lee J.	Applied Thermal Engineering	https://doi.org/10.1016/j.applthermaleng.2021.116571	\N	\N	\N	\N	\N	t	20	2026-05-20 15:07:43.709	2026-06-01 08:28:37.298	/legacy/thumb-cc61d2e4480b7334f13976d067e6f56f_4KeLfmba_8d8e180dad38b582abb1db4bc31ff5dfd308ab2a_202x150.jpg
cmpe74j4v0013gzx149q5pynt	JOURNAL	2021	Effects and limitations of superhydrophobic surfaces on the heat transfer performance of a two-phase closed thermosyphon	Seo D., Park J., Shim J., Nam J., Shin D.H., Nam Y., Lee J.	International Journal of Heat and Mass Transfer	https://doi.org/10.1016/j.ijheatmasstransfer.2021.121446	\N	\N	\N	\N	\N	t	22	2026-05-20 15:07:43.711	2026-06-01 08:28:37.356	/legacy/thumb-cc61d2e4480b7334f13976d067e6f56f_hZAz5ftr_ac9e4f74891863492e9768a3caee60a1dd9fbe62_202x150.jpg
cmpe74j4w0014gzx1r2tqc167	JOURNAL	2021	Enhancing heat transfer performance of a two-phase closed thermosyphon using a polymer-coated hydrophobic condenser	Seo D., Park J., Shim J., Nam J., Shin D.H., Nam Y., Lee J.	Applied Thermal Engineering	https://doi.org/10.1016/j.applthermaleng.2021.117350	\N	\N	\N	\N	\N	t	23	2026-05-20 15:07:43.712	2026-06-01 08:28:37.365	/legacy/thumb-cc61d2e4480b7334f13976d067e6f56f_OA5R6GUM_b3877a6d12defda39250204613a51295e24150e0_202x150.jpg
cmpe74j4w0015gzx17t6c7zrj	JOURNAL	2021	Flat plate two-phase heat spreader on the thermal management of high-power electronics: a review	Lim H., Lee J.	Journal of Mechanical Science and Technology	https://doi.org/10.1007/s12206-021-1042-x	\N	\N	\N	\N	\N	t	24	2026-05-20 15:07:43.712	2026-06-01 08:28:37.372	/legacy/thumb-c153cb953644731e198e00420b95da9a_eqNvnWLm_73d708339c6e3f21b1dc2f70322eb8e31dc0ef88_202x150.jpg
cmpe74j4x0016gzx18y1hh2xi	JOURNAL	2021	Effect of integrated copper pad on the performance of boiling-driven wickless thermal ground plane	Moon J.H., Wang X., Fadda D., Shin D.H., Lee J., You S.M.	Applied Thermal Engineering	https://doi.org/10.1016/j.applthermaleng.2021.117595	\N	\N	\N	\N	\N	t	25	2026-05-20 15:07:43.713	2026-06-01 08:28:37.381	/legacy/thumb-cc61d2e4480b7334f13976d067e6f56f_ehK25sHV_6a34420e66db4a568056eb3c6231851191658694_202x150.jpg
cmpe74j4z0018gzx17gp0rhp7	JOURNAL	2020	Bubble Behavior in Pool Boiling Heat Transfer between Two Plates with a Narrow Gap	Kim J.S., Shin D.H., Kim Y., You S.M., Lee J.	Journal of Heat Transfer	https://doi.org/10.1115/1.4046116	\N	\N	\N	\N	\N	t	27	2026-05-20 15:07:43.715	2026-06-01 08:28:37.399	/legacy/thumb-c153cb953644731e198e00420b95da9a_NZYEo0zU_3e6e4f2f13915c5490200083024d23aa92208c35_202x150.jpg
cmpe74j500019gzx18fma11ld	JOURNAL	2020	Capillary evaporation of water from aluminum high-temperature conductive microporous coating	Wang X., Fadda D., Godinez J.C., Lee J., You S.M.	International Journal of Heat and Mass Transfer	https://doi.org/10.1016/j.ijheatmasstransfer.2020.119660	\N	\N	\N	\N	\N	t	28	2026-05-20 15:07:43.716	2026-06-01 08:28:37.438	/legacy/thumb-cc61d2e4480b7334f13976d067e6f56f_MilAS0sz_198d5560dcd0c7ba52bc6f6c896b10941a9ca413_202x150.jpg
cmpe74j52001bgzx13jmw69k5	JOURNAL	2020	Precise infrared thermometry with considering background radiation for gas turbine air cooling application	Shin D.H., Kim M., Kim J.S., Lee B.J., Lee J.	International Journal of Thermal Sciences	https://doi.org/10.1016/j.ijthermalsci.2020.106534	\N	\N	\N	\N	\N	t	30	2026-05-20 15:07:43.718	2026-06-01 08:28:37.48	/legacy/thumb-c153cb953644731e198e00420b95da9a_E9U2vGaV_aae4d3ad8a9d26f2c1d15b2206160823a06fef17_202x150.jpg
cmpe74j53001cgzx1244c3per	JOURNAL	2020	Pool boiling heat transfer on bare and microporous surfaces confined in a narrow gap	Kim J.S., Shin D.H., You S.M., Lee J.	International Journal of Heat and Mass Transfer	https://doi.org/10.1016/j.ijheatmasstransfer.2020.120329	\N	\N	\N	\N	\N	t	31	2026-05-20 15:07:43.719	2026-06-01 08:28:37.495	/legacy/thumb-cc61d2e4480b7334f13976d067e6f56f_ry4FIblv_32a61906bb3de88a54400ef10fd0c44b68a21adb_202x150.jpg
cmpe74j53001dgzx1wcu11ofe	JOURNAL	2020	Evaporation of highly wetting fluids on aluminum microporous coating	Wang X., Fadda D., Godinez J.C., Lee J., You S.M.	International Journal of Heat and Mass Transfer	https://doi.org/10.1016/j.ijheatmasstransfer.2020.120451	\N	\N	\N	\N	\N	t	32	2026-05-20 15:07:43.719	2026-06-01 08:28:37.506	/legacy/thumb-cc61d2e4480b7334f13976d067e6f56f_YP824WR9_d4aaef3f352fd8ad4cc5ddef54391993b0e89f10_202x150.jpg
cmpe74j54001egzx1s6moeq7h	JOURNAL	2019	Fabrication of micro-patterned surface for pool-boiling enhancement by using powder injection molding process	Cho H., Godinez J., Han J.S., Fadda D., You S.M., Lee J., Park S.J.	Materials	https://doi.org/10.3390/ma12030507	\N	\N	\N	\N	\N	t	33	2026-05-20 15:07:43.72	2026-06-01 08:28:37.564	/legacy/thumb-c153cb953644731e198e00420b95da9a_aSG6z1IP_4a272b38ba78e9a07ed4a26024d328c31efe42f0_202x150.png
cmpe74j56001ggzx1z437ya0m	JOURNAL	2019	Enhancement of pool boiling heat transfer in water on aluminum surface with high temperature conductive microporous coating	Godinez J.C., Fadda D., Lee J., You S.M.	International Journal of Heat and Mass Transfer	https://doi.org/10.1016/j.ijheatmasstransfer.2018.11.166	\N	\N	\N	\N	\N	t	35	2026-05-20 15:07:43.722	2026-06-01 08:28:37.586	/legacy/thumb-cc61d2e4480b7334f13976d067e6f56f_XBHh2mMe_3a4be5e609e88a225059547a380d3871df344628_202x150.jpg
cmpe74j57001hgzx1y82yw979	JOURNAL	2019	Quench subcooled-jet impingement boiling: Staggered-array jets enhancement	Lee S.G., Kaviany M., Lee J.	International Journal of Heat and Mass Transfer	https://doi.org/10.1016/j.ijheatmasstransfer.2019.03.056	\N	\N	\N	\N	\N	t	36	2026-05-20 15:07:43.723	2026-06-01 08:28:37.596	/legacy/thumb-cc61d2e4480b7334f13976d067e6f56f_i5PplTtz_49be9656d1a078b3ae39f4a92c3f8b1b1030aff2_202x150.jpg
cmpe74j58001igzx1vt9rdht1	JOURNAL	2019	Development of a stable Boehmite layer on aluminum surfaces for improved pool boiling heat transfer in water	Godinez J.C., Fadda D., Lee J., You S.M.	Applied Thermal Engineering	https://doi.org/10.1016/j.applthermaleng.2019.04.065	\N	\N	\N	\N	\N	t	37	2026-05-20 15:07:43.724	2026-06-01 08:28:37.606	/legacy/thumb-cc61d2e4480b7334f13976d067e6f56f_0axSOY4j_bb922105baf42dbdfaf43a781c219b6550038939_202x150.jpg
cmpe74j59001kgzx13y4kksou	JOURNAL	2019	Visualization of Two-phase Bursting Flow Effect on the Two-Phase Closed Thermosyphon	Kim Y., Shin D.H., Kim J.S., You S.M., Lee J.	Journal of Heat Transfer	https://doi.org/10.1115/1.4044587	\N	\N	\N	\N	\N	t	39	2026-05-20 15:07:43.725	2026-06-01 08:28:37.635	/legacy/thumb-c153cb953644731e198e00420b95da9a_blmnavXF_b78e57155753e175bdf6e08431ff11ffc5399ae3_202x150.jpg
cmpe74j5b001mgzx1fr75aqx9	JOURNAL	2019	Effects of hydrophobic and superhydrophobic coatings of a condenser on the thermal performance of a two-phase closed thermosyphon	Kim Y., Kim J.S., Shin D.H., Seo J.H., You S.M., Lee J.	International Journal of Heat and Mass Transfer	https://doi.org/10.1016/j.ijheatmasstransfer.2019.118706	\N	\N	\N	\N	\N	t	41	2026-05-20 15:07:43.727	2026-06-01 08:28:37.652	/legacy/thumb-cc61d2e4480b7334f13976d067e6f56f_0a9mw8g1_2aab3e7047cff8e38183e15ecd94a60e14fceffb_202x150.jpg
cmpe74j5c001ngzx12a8za4pb	JOURNAL	2018	Effect of surface roughness on pool boiling heat transfer of water on hydrophobic surfaces	Kim J.S., Girard A., Jun S., Lee J., You S.M.	International Journal of Heat and Mass Transfer	https://doi.org/10.1016/j.ijheatmasstransfer.2017.10.124	\N	\N	\N	\N	\N	t	42	2026-05-20 15:07:43.728	2026-06-01 08:28:37.664	/legacy/thumb-cc61d2e4480b7334f13976d067e6f56f_1u2EFUoM_6098541c3491dc9a3759eb97c4128a7dc83a5e53_202x150.jpg
cmpe74j5d001ogzx11gh0ngp9	JOURNAL	2018	Boiling Heat Transfer Characteristics of Staggered-array Water Impinging Jets on Hot Steel Plate	Lee S.G., Kim J.S., Shin D.H., Lee J.	Journal of Heat Transfer	https://doi.org/10.1115/1.4039168	\N	\N	\N	\N	\N	t	43	2026-05-20 15:07:43.729	2026-06-01 08:28:37.678	/legacy/thumb-c153cb953644731e198e00420b95da9a_WHsBgFtY_930791898bb30ef232ce4b0c5832f1b9dd7e2ccf_202x150.jpg
cmpe74j5e001qgzx10psm00e4	JOURNAL	2018	Nucleate boiling comparison between teflon-coated plain copper and Cu-HTCMC in water	Jun S., Kim J.S., Lee J., You S.M.	Journal of Heat Transfer	https://doi.org/10.1115/1.4040396	\N	\N	\N	\N	\N	t	45	2026-05-20 15:07:43.73	2026-06-01 08:28:37.711	/legacy/thumb-c153cb953644731e198e00420b95da9a_x0YGVnZ3_8a2de7c562d662bd04189c4ad4a6455c0e92e79a_202x150.jpg
cmpe74j5f001rgzx1mrt76bc6	JOURNAL	2018	Visualization of dropwise condensation on a superhydrophobic microporous surface	Kim J.S., Shin D.H., Moon W., Heo J., Lee J.	Journal of Heat Transfer	https://doi.org/10.1115/1.4040395	\N	\N	\N	\N	\N	t	46	2026-05-20 15:07:43.731	2026-06-01 08:28:37.726	/legacy/thumb-c153cb953644731e198e00420b95da9a_WJTtsRlM_7086f66c2214867441ac68cac6e4a61b14bf07c0_202x150.jpg
cmpe74j5h001tgzx1ahc78enz	JOURNAL	2018	Effects of surface wettability on pool boiling of water using super-polished silicon surfaces	Mohammadi N., Fadda D., Choi C.K., Lee J., You S.M.	International Journal of Heat and Mass Transfer	https://doi.org/10.1016/j.ijheatmasstransfer.2018.07.122	\N	\N	\N	\N	\N	t	48	2026-05-20 15:07:43.733	2026-06-01 08:28:37.79	/legacy/thumb-cc61d2e4480b7334f13976d067e6f56f_3OtduMBJ_72011099662b36cdce682f14b6e2f9983f2c9583_202x150.jpg
cmpe74j5h001ugzx1caj9lst0	JOURNAL	2018	Numerical study on flow and heat transfer characteristics of air-jet cooling system	Moon J.H., Lee S., Park J.M., Lee J., Kim D., Lee S.H.	Journal of Mechanical Science and Technology	https://doi.org/10.1007/s12206-018-1152-2	\N	\N	\N	\N	\N	t	49	2026-05-20 15:07:43.733	2026-06-01 08:28:37.801	/legacy/thumb-c153cb953644731e198e00420b95da9a_5A4C1xYq_4ef119cf25eccdf6b7d13a08046767e91da3be29_202x150.jpg
cmpe74j5j001wgzx1su56misc	JOURNAL	2017	Quasi-steady front in quench subcooled-jet impingement boiling: Experiment and analysis	Lee S.G., Kaviany M., Kim C.-J., Lee J.	International Journal of Heat and Mass Transfer	https://doi.org/10.1016/j.ijheatmasstransfer.2017.05.081	\N	\N	\N	\N	\N	t	51	2026-05-20 15:07:43.735	2026-06-01 08:28:37.856	/legacy/thumb-cc61d2e4480b7334f13976d067e6f56f_Jp7kLDxH_56396310e214db74d5d3fef83c5f55e2d2a29766_202x150.jpg
cmpe74j5k001xgzx1pwypxdvl	JOURNAL	2017	Flow Visualization inside Thermosyphon for Measuring Heat Transfer Limit	Lee J., Park J., Kim J., You S.M.	Journal of Heat Transfer	https://doi.org/10.1115/1.4035581	\N	\N	\N	\N	\N	t	52	2026-05-20 15:07:43.736	2026-06-01 08:28:37.863	/legacy/thumb-c153cb953644731e198e00420b95da9a_1PGKnYjt_2e395a92499572e02187acd56f98c6c8f1a734a7_202x150.jpg
cmpe74j5k001ygzx1h3ebgap3	JOURNAL	2017	Visual Onset of Nucleate Boiling in Water Spray Cooling on Hot Steel Plate	Lee J., Lee S.G., Kim J.	Journal of Heat Transfer	https://doi.org/10.1115/1.4035582	\N	\N	\N	\N	\N	t	53	2026-05-20 15:07:43.736	2026-06-01 08:28:37.871	/legacy/thumb-c153cb953644731e198e00420b95da9a_dH0FST91_cc3e97bab05e8ecfaf94c66339df3f78a8fb508f_202x150.jpg
cmpe74j5l001zgzx187vffr15	JOURNAL	2017	Flow Boiling Heat Transfer of Subcooled Water on Sintered Microporous Surfaces	Kim Y., Kim J., You S.M., Lee J.	Journal of Heat Transfer	https://doi.org/10.1115/1.4036883	\N	\N	\N	\N	\N	t	54	2026-05-20 15:07:43.737	2026-06-01 08:28:37.88	/legacy/thumb-c153cb953644731e198e00420b95da9a_y8cf1l2J_3a72e0ba8619fb250c70c55d88163b808672543a_202x150.jpg
cmpe74j5n0021gzx1bf3pmcrq	JOURNAL	2017	Effect of Surface Roughness on Pool Boiling Heat Transfer of Water on a Superhydrophilic Aluminum Surface	Kim J., Jun S., Lee J., Godinez J., You S.M.	Journal of Heat Transfer	https://doi.org/10.1115/1.4036599	\N	\N	\N	\N	\N	t	56	2026-05-20 15:07:43.739	2026-06-01 08:28:37.908	/legacy/thumb-c153cb953644731e198e00420b95da9a_Ev8i1cFG_79140d9c9f8872d588934528ea0e1d9f796c8469_202x150.jpg
cmpe74j5o0023gzx1n2fhp9iy	JOURNAL	2016	Boiling visualization of two adjacent impinging jets on hot steel plate	Lee J., Sohn S., Lee S.G.	Journal of Heat Transfer	https://doi.org/10.1115/1.4032253	\N	\N	\N	\N	\N	t	58	2026-05-20 15:07:43.74	2026-06-01 08:28:37.995	/legacy/thumb-c153cb953644731e198e00420b95da9a_XRHsAvyg_9b8d6b56c1495b224c4644f0b4b9996c738e087d_202x150.jpg
cmpe74j5p0024gzx176mclmta	JOURNAL	2016	Visualization of terrain-induced slugging in W-shaped pipeline	Lee J., Park J., Sohn S.	Journal of Heat Transfer	https://doi.org/10.1115/1.4032252	\N	\N	\N	\N	\N	t	59	2026-05-20 15:07:43.741	2026-06-01 08:28:38.01	/legacy/thumb-c153cb953644731e198e00420b95da9a_CtFbOdop_5e5cd329a0e8942b44d0d5514044139d67b4ed77_202x150.jpg
cmpe74j5q0025gzx10erttx43	JOURNAL	2016	Frosting characteristics on hydrophilic and superhydrophobic copper surfaces	Jeong C.H., Lee J.B., Lee S.H., Lee J., You S.M., Choi C.K.	Journal of Heat Transfer	https://doi.org/10.1115/1.4032257	\N	\N	\N	\N	\N	t	60	2026-05-20 15:07:43.742	2026-06-01 08:28:38.019	/legacy/thumb-c153cb953644731e198e00420b95da9a_JiAou5Sy_3c6e9f46ae567beb34404fdcee80f04d52074acc_202x150.jpg
cmpe74j5r0026gzx13zjzcfad	JOURNAL	2016	Effect of Wettability on Pool Boiling Incipience in Saturated Water	Kim J., Jun S., Lee J., Lee S.H., You S.M.	Journal of Heat Transfer	https://doi.org/10.1115/1.4033815	\N	\N	\N	\N	\N	t	61	2026-05-20 15:07:43.743	2026-06-01 08:28:38.029	/legacy/thumb-c153cb953644731e198e00420b95da9a_IXfrxjbL_8ae7610c37c398fb5f762b0c4a63cc6fd5b9f492_202x150.jpg
cmpe74j5s0028gzx1ckkptale	JOURNAL	2015	Numerical analysis of thermal mixing in a swirler-embedded line-heater for flow assurance in subsea pipelines	Park J.M., Oh D.-W., Lee J.	Advances in Mechanical Engineering	https://doi.org/10.1155/2014/739089	\N	\N	\N	\N	\N	t	63	2026-05-20 15:07:43.744	2026-06-01 08:28:38.053	/legacy/thumb-c153cb953644731e198e00420b95da9a_K0toqRAx_443894299b115f8f264e61b9292ff910313560f9_202x150.jpg
cmpe74j5t0029gzx1uuqgzo4v	JOURNAL	2015	Visual observation of circular water jet impingement boiling on stationary hot steel plate	Lee J., Sohn S., Park J.	Journal of Heat Transfer	https://doi.org/10.1115/1.4030474	\N	\N	\N	\N	\N	t	64	2026-05-20 15:07:43.745	2026-06-01 08:28:38.069	/legacy/thumb-c153cb953644731e198e00420b95da9a_o7PBDCyK_6214cd1a80b5dd869f1083b95b8d774952e290f8_202x150.jpg
cmpe74j5t002agzx1grn22tqb	JOURNAL	2015	Visual Criteria for Measuring Two-phase Flow Rate in Venturi with Flow Homogenizer	Lee J., Sohn S., Park J., Oh D.-W.	Journal of Heat Transfer	https://doi.org/10.1115/1.4030475	\N	\N	\N	\N	\N	t	65	2026-05-20 15:07:43.745	2026-06-01 08:28:38.078	/legacy/thumb-c153cb953644731e198e00420b95da9a_LDk2jcWb_64addd44c2370fd22632325f8350e1e7df85591f_202x150.jpg
cmpe74j69002ugzx113koaocm	JOURNAL	2024	Effects of cover plate wettability on pool boiling heat transfer in a narrow gap	Aqsa Rukhsar, Dani Fadda, Xiaomeng Wang, Jungho Lee*, Seung M. You*	International Journal of Heat and Mass Transfer	https://doi.org/10.1016/j.ijheatmasstransfer.2023.125130	\N	\N	\N	\N	\N	t	91	2026-05-20 15:07:43.761	2026-06-01 08:28:36.678	/legacy/thumb-a85600f146438a9a873aabd3266d4871_lDG0ZvEB_fd0ccb425ec748f6215efa899a8b5a6f96aaebae_202x150.jpg
cmpe74j6a002vgzx1jl6f7sp1	JOURNAL	2024	Pool boiling heat transfer enhancement using the micro-thick metallic foam surface in saturated water	Hyunmuk Lim, Su-Yoon Doh, Junyoung Choi, Jungchan Moc, Seung M. You, Jungho Lee	International Communications in Heat and Mass Transfer	https://doi.org/10.1016/j.icheatmasstransfer.2024.107310	\N	\N	\N	\N	\N	t	92	2026-05-20 15:07:43.762	2026-06-01 08:28:36.701	/legacy/thumb-a85600f146438a9a873aabd3266d4871_TfI1sycb_1843e265e5682dcf89882909084f693113a5136d_202x150.jpg
cmpe74j6b002wgzx1il15tg1l	JOURNAL	2024	Compact heat pipe heat exchanger for waste heat recovery within a  low-temperature range	Jinhyeuk Seo, Sukkyung Kang, Kyuil Kim, Jungho Lee	International Communications in Heat and Mass Transfer	https://doi.org/10.1016/j.icheatmasstransfer.2024.107550	\N	\N	\N	\N	\N	t	93	2026-05-20 15:07:43.763	2026-06-01 08:28:36.714	/legacy/thumb-02ac42d8c7b053493aa60911f12092d5_9JbnNjmK_bc25f2198bb634e4ab7528c58bda14fa233c5ec4_202x150.jpg
cmpe74j6c002xgzx1cn3ojp82	JOURNAL	2024	Empirical modeling and experimental validation of gas-to-liquid heat pipe heat exchanger with baffles	Sukkyung Kang, Kyuil Kim, JinHyeuk Seo, Jungho Lee	Energy	https://doi.org/10.1016/j.energy.2024.131972	\N	\N	\N	\N	\N	t	94	2026-05-20 15:07:43.764	2026-06-01 08:28:36.727	/legacy/thumb-48cde7be0dc744a4c1fa125f1d61fe2b_7AcRJgTh_6a35023d760f3c48b3f94902e5bafa7c5b6e145c_202x150.jpg
cmpe74j65002pgzx1103j2zod	JOURNAL	2023	New thermal packaging with a boiling-driven heat spreader for thermal management of the power electronics	Lim H., You S.M., Lee J.	Applied Thermal Engineering	https://doi.org/10.1016/j.applthermaleng.2022.119515	\N	\N	\N	\N	\N	t	86	2026-05-20 15:07:43.757	2026-06-01 08:28:36.866	/legacy/thumb-c153cb953644731e198e00420b95da9a_HstracNQ_2ce171418f9e9d784c5ea806753071b785482bf2_202x150.jpg
cmpe74j66002qgzx1bfx7enn8	JOURNAL	2023	Effect of Marangoni condensation on the heat transfer performance of two-phase closed thermosyphons	Seo D., Seo J.H., Shim J., Nam Y., Lee J.	International Journal of Heat and Mass Transfer	https://doi.org/10.1016/j.ijheatmasstransfer.2022.123669	\N	\N	\N	\N	\N	t	87	2026-05-20 15:07:43.758	2026-06-01 08:28:36.885	/legacy/thumb-c153cb953644731e198e00420b95da9a_tIQzrXYU_4b04c73440610dbffacc0366b15ffc2d726e8977_202x150.jpg
cmpe74j68002sgzx16cswcn2t	JOURNAL	2023	Effect of inner diameter on the confinement of two-phase closed thermosyphon	Sukkyung Kang, Jin Hyeuk Seo, Jungho Lee	International Communications in Heat and Mass Transfer	https://doi.org/10.1016/j.icheatmasstransfer.2023.106997	\N	\N	\N	\N	\N	t	89	2026-05-20 15:07:43.76	2026-06-01 08:28:36.93	/legacy/thumb-c153cb953644731e198e00420b95da9a_wCHVrGa9_fcbb7fbb41952e7f4cbf19fb356087d4a8267d54_202x150.jpg
cmpe74j5y002hgzx1x69sjzsh	JOURNAL	2022	Experimental investigation of heat spreading in a wickless and ultrathin thermal ground plane	Wang X., Moon J.H., Fadda D., Shin D.H., Lee J., You S.M.	Case Studies in Thermal Engineering	https://doi.org/10.1016/j.csite.2022.101799	\N	\N	\N	\N	\N	t	78	2026-05-20 15:07:43.75	2026-06-01 08:28:36.947	/legacy/thumb-c153cb953644731e198e00420b95da9a_rlOXnbio_a9b2bfeab11055b298b36fb98d167ff970b83e8b_202x150.jpg
cmpe74j5z002igzx1s9y390xz	JOURNAL	2022	Flow characterization of microscale effusion and transpiration air cooling on single blade	Kim M., Shin D.H., Lee B.J., Lee J.	Case Studies in Thermal Engineering	https://doi.org/10.1016/j.csite.2022.101863	\N	\N	\N	\N	\N	t	79	2026-05-20 15:07:43.751	2026-06-01 08:28:36.97	/legacy/thumb-c153cb953644731e198e00420b95da9a_qGcaTpYf_374ba8b65009c3bc3af1d2dc196ade26c4e7d40f_202x150.jpg
cmpe74j60002jgzx1bpn23oqm	JOURNAL	2022	Numerical study of the boiling heat transfer characteristics of bluff body quenching in cylindrical tube	Moon J.H., Lee J., Lee S.H.	Case Studies in Thermal Engineering	https://doi.org/10.1016/j.csite.2022.101900	\N	\N	\N	\N	\N	t	80	2026-05-20 15:07:43.752	2026-06-01 08:28:36.992	/legacy/thumb-c153cb953644731e198e00420b95da9a_T6PcIMsQ_274e84c9a4d634f7a26c566ec6760d41b1d4c6b9_202x150.jpg
cmpe74j61002kgzx18ql8m3c0	JOURNAL	2022	Numerical study on subcooled water jet impingement cooling on superheated surfaces	Moon J.H., Lee S., Lee J., Lee S.H.	Case Studies in Thermal Engineering	https://doi.org/10.1016/j.csite.2022.101883	\N	\N	\N	\N	\N	t	81	2026-05-20 15:07:43.753	2026-06-01 08:28:37.009	/legacy/thumb-c153cb953644731e198e00420b95da9a_5LgYRA6s_d794241808b2a8bce54286cbcf06e2768438a71a_202x150.jpg
cmpe74j63002mgzx1c0jmcavb	JOURNAL	2022	Role of quenching method on cooling rate and microstructure of steels: Variations in coolant and its flow arrangement	Lee S.G., Kaviany M., Lee J.	International Journal of Heat and Mass Transfer	https://doi.org/10.1016/j.ijheatmasstransfer.2022.122702	\N	\N	\N	\N	\N	t	83	2026-05-20 15:07:43.755	2026-06-01 08:28:37.056	/legacy/thumb-c153cb953644731e198e00420b95da9a_Of6G52d7_b6b4d94cc918326ec64ff737e8740a7621fa519d_202x150.jpg
cmpe74j63002ngzx1vza849o5	JOURNAL	2022	Effect of wettability on pool boiling heat transfer with copper microporous coated surface	Wang X., Fadda D., Godinez J., Lee J., You S.M.	International Journal of Heat and Mass Transfer	https://doi.org/10.1016/j.ijheatmasstransfer.2022.123059	\N	\N	\N	\N	\N	t	84	2026-05-20 15:07:43.755	2026-06-01 08:28:37.068	/legacy/thumb-c153cb953644731e198e00420b95da9a_IQPwZFT1_f1d68962a91accad8dc3d139b47a159ebccf2d76_202x150.jpg
cmpe74j5v002cgzx13ifmrkxb	JOURNAL	2014~Before	Evolution of differential pressure inside a venturi tube with traveling air slug	Oh D.-W., Bae J.H., Park J.M., Lee J.	Journal of Heat Transfer	https://doi.org/10.1115/1.4027520	\N	\N	\N	\N	\N	t	69	2026-05-20 15:07:43.747	2026-06-01 08:28:38.098	/legacy/thumb-c153cb953644731e198e00420b95da9a_zPD0t7Wq_aac14ce23abdab72b363f726f7959a02552b5c5f_202x150.jpg
cmpe74j5v002dgzx1rwsngndr	JOURNAL	2014~Before	Effect of buried depth on steady-state heat-transfer characteristics for pipeline-flow assurance	Oh D.-W., Park J.M., Lee K.H., Zakarian E., Lee J.	SPE Journal	https://doi.org/10.2118/166595-PA	\N	\N	\N	\N	\N	t	70	2026-05-20 15:07:43.747	2026-06-01 08:28:38.126	/legacy/thumb-c153cb953644731e198e00420b95da9a_N2vsSWjn_fe7e0d63bdc3d4075c63efe3ecfdc935696d02c3_202x150.png
cmpe74j5w002egzx1vvzcghe0	JOURNAL	2014~Before	Effect of water temperature on heat transfer characteristic of spray cooling on hot steel plate	Lee J., Yu C.-H., Park S.-J.	Transactions of the Korean Society of Mechanical Engineers, B	https://doi.org/10.3795/KSME-B.2011.35.5.503	\N	\N	\N	\N	\N	t	71	2026-05-20 15:07:43.748	2026-06-01 08:28:38.148	/legacy/thumb-c153cb953644731e198e00420b95da9a_hgJWPMEz_a3d12ff135869c03c88d7f13e1dab2344a791993_202x150.gif
cmpe74j5x002fgzx1rkwqtqmd	JOURNAL	2014~Before	Heat transfer enhancement of water spray cooling by the surface roughness effect	Lee J.	Transactions of the Korean Society of Mechanical Engineers, B	https://doi.org/10.3795/KSME-B.2010.34.2.203	\N	\N	\N	\N	\N	t	72	2026-05-20 15:07:43.749	2026-06-01 08:28:38.191	/legacy/thumb-c153cb953644731e198e00420b95da9a_4Zr58O9a_027d8bdd5cc013db629c124c8a3bcf17e77cea20_202x150.gif
cmpe74j5y002ggzx1aegi89ov	JOURNAL	2014~Before	Role of surface roughness in water spray cooling heat transfer of hot steel plate	Lee J.	ISIJ International	https://doi.org/10.2355/isijinternational.49.1920	\N	\N	\N	\N	\N	t	73	2026-05-20 15:07:43.75	2026-06-01 08:28:38.36	/legacy/thumb-c153cb953644731e198e00420b95da9a_8wBoqQzy_f9504c56520134e5824fca510164273a272facbb_202x150.jpg
cmpe74j6k0036gzx1u13crx65	JOURNAL	2025	Thermal design framework of heat pipe heat exchanger for efficient waste heat recovery	Seungjae Lee,  Sukkyung Kang,  Yunseo Kim,  Gyohoon Geum,  Daeyoung Kong,  Dong Hwan Shin,  Seong Hyuk Lee,  Jungho Lee* ,  Hyoungsoon Lee*	Energy	https://doi.org/10.1016/j.energy.2025.134731	\N	\N	\N	\N	\N	t	103	2026-05-20 15:07:43.772	2026-06-01 08:28:36.248	/legacy/thumb-36b0db35ca0e5f48e2fa87650c6fc9bc_RVzJ75kc_509c6280821d0f3f098d2573bf9d4198f299df71_202x150.jpg
cmpe74j6l0037gzx1w6mhxsds	JOURNAL	2025	Effective snow removal devices for road pavement using geothermal heat pipe	Hyunmuk Lim,  Seokjin Lee,  Jungho Lee*	Applied Thermal Engineering	https://doi.org/10.1016/j.applthermaleng.2025.125624	\N	\N	\N	\N	\N	t	104	2026-05-20 15:07:43.773	2026-06-01 08:28:36.256	/legacy/thumb-36b0db35ca0e5f48e2fa87650c6fc9bc_cpfdv8kV_d7e67178a114ba3ec03f20128314d837daa5d420_202x150.jpg
cmpe74j6m0038gzx1xwzeirfc	JOURNAL	2025	Evaluation of Spreading Thermal Resistance of Boiling-Driven Heat Spreader	Jung  Chan  Moc,  Su  Yoon  Doh,  Seong  Mook  Jeong,  Sung  Hun  Lee, Yoon  Ju  Jung,  Jungho  Lee*	The KSFM Journal of Fluid Machinery	\N	\N	\N	\N	\N	\N	t	105	2026-05-20 15:07:43.774	2026-06-01 08:28:36.274	/legacy/thumb-0f3ba66eb9d874349e0f3e4eb0b6cc8b_2ZWrFgTG_a05b4c7a1673e014bd0d33c992ab7eee6f722de1_202x150.jpg
cmpe74j6n003agzx1l8q19pfk	JOURNAL	2025	Working principles of wickless thermal ground planes	Hootan Rahimi, Dani Fadda, Jungho Lee*, Seung M. You*	Applied Thermal Engineering	https://doi.org/10.1016/j.applthermaleng.2025.125922	\N	\N	\N	\N	\N	t	107	2026-05-20 15:07:43.775	2026-06-01 08:28:36.293	/legacy/thumb-0f3ba66eb9d874349e0f3e4eb0b6cc8b_8T3JLEHV_fd0827f40154b359d83a27f32cc44a547fad8e62_202x150.jpg
cmpe74j6p003cgzx12ucmg5rl	JOURNAL	2025	Confinement effect in two-phase closed thermosyphon	Sukkyung Kang,  Jungho Lee*	International Communications in Heat and Mass Transfer	https://doi.org/10.1016/j.icheatmasstransfer.2025.108938	\N	\N	\N	\N	\N	t	109	2026-05-20 15:07:43.777	2026-06-01 08:28:36.32	/legacy/thumb-0f3ba66eb9d874349e0f3e4eb0b6cc8b_PqM58kxQ_2cbd3d96bb81e5cf73a211cf66a0f50a6973c984_202x150.png
cmpe74j6q003dgzx1zseseu1g	JOURNAL	2025	Performance enhancement of two-phase closed thermosyphon with threaded evaporator surface	Sukkyung Kang,  Seokjin Lee,  Jungho Lee*	International Communications in Heat and Mass Transfer	https://doi.org/10.1016/j.icheatmasstransfer.2025.108939	\N	\N	\N	\N	\N	t	110	2026-05-20 15:07:43.778	2026-06-01 08:28:36.332	/legacy/thumb-0f3ba66eb9d874349e0f3e4eb0b6cc8b_Aj7pJVNR_e2e820a88615fccd99f71ff7d1c00ee62ce5efe1_202x150.png
cmpe74j6r003egzx1rvs9926g	JOURNAL	2025	Effects of working fluid on thermal performance and impact force of two-phase closed thermosyphon at low heat flux	JinHyeuk Seo , Jungho Lee*	International Communications in Heat and Mass Transfer	https://doi.org/10.1016/j.icheatmasstransfer.2025.109311	\N	\N	\N	\N	\N	t	111	2026-05-20 15:07:43.779	2026-06-01 08:28:36.378	/legacy/thumb-42ac65fe9e1a360388a0b1e51c6e6aa0_1751790078_8495_202x150.png
cmpe74j6r003fgzx1dgwu9zze	JOURNAL	2025	High-performance pool boiling through acetone’s compatibility with aluminum microporous surfaces	Junyoung Choi , Su-yoon Doh , Hyunmuk Lim , Jungho Lee*	International Communications in Heat and Mass Transfer	https://doi.org/10.1016/j.icheatmasstransfer.2025.109403	\N	\N	\N	\N	\N	t	112	2026-05-20 15:07:43.779	2026-06-01 08:28:36.389	/legacy/thumb-f7e7e67d261259920248c1638317c7a0_1753405087_1618_202x150.png
cmpe74j6s003ggzx1ht1u1iax	JOURNAL	2025	Effect of Sandblasted Surface on Flow Boiling Heat Transfer of R245fa	Seungwoo Choi, Su-yoon Doh, Jungho Lee*	The KSFM Journal of Fluid Machinery	https://doi.org/10.5293/kfma.2025.28.2.014	\N	\N	\N	\N	\N	t	113	2026-05-20 15:07:43.78	2026-06-01 08:28:36.408	/legacy/thumb-f7e7e67d261259920248c1638317c7a0_1753405597_8745_202x150.jpg
cmpe74j6u003igzx1b800q816	JOURNAL	2025	Effect of inner diameter and working fluids on the geyser boiling phenomenon in two-phase closed thermosyphon	JinHyeuk Seo , Jungho Lee*	International Communications in Heat and Mass Transfer	\N	\N	\N	\N	\N	\N	t	115	2026-05-20 15:07:43.782	2026-06-01 08:28:36.434	/legacy/thumb-04b8342eb26115f0deacb2c73e9efa4e_1755927899_3275_202x150.png
cmpe74j6u003jgzx19rvj8n28	JOURNAL	2025	Effective Waste Heat Recovery of Boiler Flue Gas Using a Heat Pipe Heat Exchanger: A Performance Comparison With Finned-Tube Economizer	Sukkyung Kang, JinHyeuk Seo, Jeong-Bin Lim, Jungho Lee*	International Journal of Energy Research	https://doi.org/10.1155/er/8781810	\N	\N	\N	\N	\N	t	116	2026-05-20 15:07:43.782	2026-06-01 08:28:36.445	/legacy/thumb-cdacda45873f0ee1e4fd26801a91cb67_1757992378_9378_202x150.png
cmpe74j6v003kgzx11fqw2xof	JOURNAL	2025	Superior pool boiling performance with dual-layer microporous structure in saturated water	Su-Yoon Doh, Hyunmuk Lim, Jungho Lee*	International Communications in Heat and Mass Transfer	https://doi.org/10.1016/j.icheatmasstransfer.2025.109680	\N	\N	\N	\N	\N	t	117	2026-05-20 15:07:43.783	2026-06-01 08:28:36.459	/legacy/thumb-674573eb14736479911621003927ab68_1758506095_6478_202x150.png
cmpe74j6w003lgzx11aqy2z8d	JOURNAL	2025	Thermal spreading characteristics of the boiling-driven heat spreader for high heat dissipation applications	Jungchan Moc , Su-yoon Doh , Hyunmuk Lim , Jungho Lee*	International Communications in Heat and Mass Transfer	https://doi.org/10.1016/j.icheatmasstransfer.2025.109692	\N	\N	\N	\N	\N	t	118	2026-05-20 15:07:43.784	2026-06-01 08:28:36.479	/legacy/thumb-7ad9922f2d33ba40d42deac6ba7d842d_1758774324_1022_202x150.png
cmpe74j6e002zgzx19eoa2cj4	JOURNAL	2024	Thermal performance enhancement in two-phase closed thermosyphon with sandblasted evaporator surface	Sukkyung Kang, Seokjin Lee, Jungho Lee	International Communications in Heat and Mass Transfer	https://doi.org/10.1016/j.icheatmasstransfer.2024.108027	\N	\N	\N	\N	\N	t	96	2026-05-20 15:07:43.766	2026-06-01 08:28:36.747	/legacy/thumb-02ac42d8c7b053493aa60911f12092d5_ROtxVcFU_84593ffa4d5ffd1238574c7781844986b55cfa68_202x150.jpg
cmpe74j6f0030gzx14yjclrfp	JOURNAL	2024	Development and Validation in Thermal Design Program of Thermosyphon Heat Exchanger	Kyuil Kim, JinHyeuk Seo, Sukkyung Kang, Jungho Lee	The KSFM Journal of Fluid Machinery	\N	\N	\N	\N	\N	\N	t	97	2026-05-20 15:07:43.767	2026-06-01 08:28:36.757	/legacy/thumb-89253a77ebc125832f1dd083af0d5da4_xXj4qwfz_b6cf6bd4f060d7fa2d81a93ae54cd1e74403338f_202x150.jpg
cmpe74j6g0031gzx14a93ww13	JOURNAL	2024	Pool Boiling Heat Transfer Performance of Micro-Thick Copper Foam with Porosity	Junyoung Choi, Su-yoon Doh, Jungho Lee	The KSFM Journal of Fluid Machinery	\N	\N	\N	\N	\N	\N	t	98	2026-05-20 15:07:43.768	2026-06-01 08:28:36.766	/legacy/thumb-89253a77ebc125832f1dd083af0d5da4_lLz3s0mT_b69a30385472c40ddaae674afbcbf442efc70a3c_202x150.jpg
cmpe74j6g0032gzx1yi9jwkx9	JOURNAL	2024	Thermal Performance of Eco-Friendly Thermosyphon for Snow Melting and Anti-icing	Seokjin Lee, Sukkyung Kang, Jin Hyeuk Seo, Jungho Lee	The KSFM Journal of Fluid Machinery	\N	\N	\N	\N	\N	\N	t	99	2026-05-20 15:07:43.768	2026-06-01 08:28:36.777	/legacy/thumb-89253a77ebc125832f1dd083af0d5da4_crVGZQ9h_139383983cf98fe129aa2e2773b87ac894646b3c_202x150.jpg
cmpe74j6i0034gzx10ic7tfbu	JOURNAL	2024	Impact force and occurrence condition of geyser boiling in two-phase closed thermosyphon	JinHyeuk Seo, Jungchul Lee, Jungho Lee	International Communications in Heat and Mass Transfer	https://doi.org/10.1016/j.icheatmasstransfer.2024.108262	\N	\N	\N	\N	\N	t	101	2026-05-20 15:07:43.77	2026-06-01 08:28:36.831	/legacy/thumb-0f3ba66eb9d874349e0f3e4eb0b6cc8b_q31K7LeT_6324641937d47129d88b08ee6ca65714520c58e2_202x150.jpg
cmpe74j76003wgzx1znhqien2	JOURNAL	2026	Efficient Porous-Medium Framework for Compact Heat Pipe Heat Exchanger	Seungjae Lee, Jin Hyeuk Seo, Yunseo Kim, Hoon Choi, Seong Hyuk Lee, Jungho Lee*, Hyoungsoon Lee*	International Journal of Energy Research	https://doi.org/10.1155/er/6962940	\N	\N	\N	\N	\N	t	129	2026-05-20 15:07:43.794	2026-06-12 06:27:42.802	/legacy/thumb-ee2c8142f1d2f1558b038ecff276377b_1775722922_2059_202x150.png
cmpe74j72003rgzx1slr7vy90	JOURNAL	2026	Flow boiling enhancement of R245fa from sandblasted surfaces in a minichannel heat sink	Seungwoo Choi , Jungho Lee*	Applied Thermal Engineering	https://doi.org/10.1016/j.applthermaleng.2025.129333	\N	\N	\N	\N	\N	t	124	2026-05-20 15:07:43.79	2026-06-01 08:28:36.076	/legacy/thumb-2ba5a8f90bd64bed3b88950c57603675_1765069699_1348_202x150.png
cmpe74j75003vgzx1tzx6sz58	JOURNAL	2026	Influence of wettability on water-vapor condensation over plain and microporous coated surfaces	Hootan Rahimi, Xiaomeng Wang, Dani Fadda, Jungho Lee*, Seung M. You*	Alexandria Engineering Journal	https://doi.org/10.1016/j.aej.2026.02.019	\N	\N	\N	\N	\N	t	128	2026-05-20 15:07:43.793	2026-06-01 08:28:36.206	/legacy/thumb-305c86631b9894907401df9f8fd1c103_1771981681_1656_202x150.png
cmpe74j6y003ngzx1yxvhzxrr	JOURNAL	2025	Heat Transfer Characteristics of  Single Wrap-around Loop Heat Pipe for Different Working Fluids	Jungchan Moc, Sukkyung Kang, Gangmin Geum, Jungho Lee*	The KSFM Journal of Fluid Machinery	https://doi.org/10.5293/kfma.2025.28.5.023	\N	\N	\N	\N	\N	t	120	2026-05-20 15:07:43.786	2026-06-01 08:28:36.494	/legacy/thumb-43f12c61db4b65617102a8c4ddc2c139_1763341416_4984_202x150.png
cmpe74j6z003ogzx1zx8om3po	JOURNAL	2025	Thermal Performance of Surface Characterization for Two-Phase Immersion Cooling using HFE-7200	Sanghyeon Shin, Su-yoon Doh, Jungho Lee*	The KSFM Journal of Fluid Machinery	https://doi.org/10.5293/kfma.2025.28.5.061	\N	\N	\N	\N	\N	t	121	2026-05-20 15:07:43.787	2026-06-01 08:28:36.546	/legacy/thumb-43f12c61db4b65617102a8c4ddc2c139_1763341691_8442_202x150.png
cmpe74j72003sgzx11204b0ce	JOURNAL	2025	Sustainable, Eco-Friendly, and High-Performance Geothermal Thermosyphon System for Roadway Snow-Melting and Anti-Icing: A Lab-Scale Feasibility Study	Sukkyung Kang, Seokjin Lee, Jungho Lee*	International Journal of Energy Research	https://doi.org/10.1155/er/1074439	\N	\N	\N	\N	\N	t	125	2026-05-20 15:07:43.79	2026-06-01 08:28:36.619	/legacy/thumb-ef7904f555102e881cf6a1a9ae237948_1766403627_795_202x150.png
cmpe74j79003xgzx1veidk6yu	CONFERENCE	2021	비등 기반 열전달판을 이용한 전력 전자장비의 냉각	임현묵, 이상건, 신동환, 이정호	\N	\N	대한기계학회 열공학부문 2021년도 춘계학술대회	\N	\N	\N	\N	t	2	2026-05-20 15:07:43.797	2026-05-20 15:07:43.797	\N
cmpe74j7a003ygzx1rjsfjgpx	CONFERENCE	2021	마이크로다공질 코팅 및 액체 함침 표면 코팅이 이상 밀폐 써모사이폰의 열성능에 미치는 영향	서진혁, 서동현, 신동환, 이정호	\N	\N	대한기계학회 2021년 학술대회	\N	\N	\N	\N	t	3	2026-05-20 15:07:43.798	2026-05-20 15:07:43.798	\N
cmpe74j7a003zgzx14da0c8ni	CONFERENCE	2022	비등 기반 히트 스프레더의 설치 방향에 따른 작동 메커니즘 연구	임현묵, 이정호	\N	\N	대한기계학회 열공학부문 2022년도 춘계학술대회	\N	\N	\N	\N	t	4	2026-05-20 15:07:43.798	2026-05-20 15:07:43.798	\N
cmpe74j7l004egzx1apyhhwn6	CONFERENCE	2022	다공성 모델을 이용한 히트파이프 열교환기의 열 성능 해석	금교훈, 조세현, 공대영, 이형순, 이성혁, 이정호	\N	\N	2022년 한국유체기계학회 동계학술대회	\N	\N	\N	\N	t	19	2026-05-20 15:07:43.809	2026-06-01 08:28:37.19	\N
cmpe74j7m004fgzx1cqrvug9c	CONFERENCE	2022	고열유속 국소 열원의 열관리를 위한 히트 스프레더 개발	임현묵, 이정호	\N	\N	2022년 한국유체기계학회 동계학술대회	\N	\N	\N	\N	t	20	2026-05-20 15:07:43.81	2026-06-01 08:28:37.298	\N
cmpe74j8a005pgzx1lafsn4cd	CONFERENCE	2024	Thermal Performance of Surface Characterization for Two-phase Immersion Cooling using HFE-7200	Sanghyeon Shin, Jungho Lee	\N	\N	22nd IHPC & 16th IHPS	\N	\N	\N	\N	t	66	2026-05-20 15:07:43.834	2026-05-20 15:07:43.834	\N
cmpe74j84005egzx1jv9r8mx5	CONFERENCE	2024	TPCT with sandblasted evaporator	Sukkyung Kang, Seokjin Lee, JinHyeuk Seo, Jungho Lee	\N	\N	ASME SHTC	\N	\N	\N	\N	t	55	2026-05-20 15:07:43.828	2026-06-01 08:28:37.892	\N
cmpe74j8k0066gzx1uzcij2e3	PATENT	2021	Heat-pipe type heat exchanger	\N	\N	\N	\N	Jungho Lee, Sukkyung Kang, Su-Yoon Doh	10-2021-0174762	Republic of Korea	2021-12-08	t	2	2026-05-20 15:07:43.844	2026-05-20 15:07:43.844	\N
cmpe74j8l0067gzx1uwe5ozu2	PATENT	2021	Manufacturing method for heat pipe	\N	\N	\N	\N	Jungho Lee, Sukkyung Kang, Su-Yoon Doh	10-2021-0174763	Republic of Korea	2021-12-08	t	3	2026-05-20 15:07:43.845	2026-05-20 15:07:43.845	\N
cmpe74j8m0068gzx1ho442m59	PATENT	2022	Heat-pipe type heat exchanger	\N	\N	\N	\N	Jungho Lee, Sukkyung Kang, Su-Yoon Doh	PCT/KR2022/017309	PCT	2022-11-07	t	4	2026-05-20 15:07:43.846	2026-05-20 15:07:43.846	\N
cmpe74j8m0069gzx1xbctt7st	PATENT	2022	Manufacturing method for heat pipe	\N	\N	\N	\N	Jungho Lee, Sukkyung Kang, Su-Yoon Doh	PCT/KR2022/017312	PCT	2022-11-07	t	5	2026-05-20 15:07:43.846	2026-05-20 15:07:43.846	\N
cmpe74j8n006agzx1y9lm7a1y	PATENT	2022	Sandblasting nozzle for grinding	\N	\N	\N	\N	Jungho Lee, JinHyeuk Seo, Sukkyung Kang	10-2022-0160593	Republic of Korea	2022-11-25	t	6	2026-05-20 15:07:43.847	2026-05-20 15:07:43.847	\N
cmpe74j8o006bgzx13oxutue3	PATENT	2022	Heat pipe sealing cover and heat pipe sealing method using the same	\N	\N	\N	\N	Jungho Lee, Rakyeong Yang, Sukkyung Kang	10-2022-0160594	Republic of Korea	2022-11-25	t	7	2026-05-20 15:07:43.848	2026-05-20 15:07:43.848	\N
cmpe74j8p006cgzx1orclbu6a	PATENT	2022	Injection volume control device for working fluid in heat pipe	\N	\N	\N	\N	Jungho Lee, Kyuil Kim, Sukkyung Kang	10-2022-0160595	Republic of Korea	2022-11-25	t	8	2026-05-20 15:07:43.849	2026-05-20 15:07:43.849	\N
cmpe74j8p006dgzx16vcl4hfr	PATENT	2022	Cooling device for reactor core melt	\N	\N	\N	\N	Jungho Lee	10-2022-0163495	Republic of Korea	2022-11-29	t	9	2026-05-20 15:07:43.849	2026-05-20 15:07:43.849	\N
cmpe74j6x003mgzx1a3132xo7	JOURNAL	2026	Thermal performance of liquid-filled TGPs: Structural and degassing effects	Hootan Rahimi, Hyunmuk Lim, Dani Fadda, Jungho Lee*, Seung M. You*	Applied Thermal Engineering	https://doi.org/10.1016/j.applthermaleng.2025.129001	\N	\N	\N	\N	\N	t	119	2026-05-20 15:07:43.785	2026-06-01 08:28:36.035	/legacy/thumb-017858957c43a13545ef9748246adc6d_1762854074_9088_202x150.png
cmpe74j71003qgzx1m3nzwszi	JOURNAL	2026	Orientation dependence in narrow gap boiling heat transfer using a microporous heating surface and cover plates of different wettability	Aqsa Rukhsar, Dani Fadda, Jungho Lee*, Seung M. You*	International Communications in Heat and Mass Transfer	https://doi.org/10.1016/j.icheatmasstransfer.2025.110119	\N	\N	\N	\N	\N	t	123	2026-05-20 15:07:43.789	2026-06-01 08:28:36.061	/legacy/thumb-d8b689bfb0c21aa7c87dfd9bc0df1943_1764229112_2694_202x150.png
cmpe74j73003tgzx16tct4w0c	JOURNAL	2026	Boiling-driven heat spreader for thermal management of high-power chips in liquid cooling applications	Su-Yoon Doh, Seung M. You, Seongmook Jeong, Jungho Lee*	Applied Thermal Engineering	https://doi.org/10.1016/j.applthermaleng.2026.129715	\N	\N	\N	\N	\N	t	126	2026-05-20 15:07:43.791	2026-06-01 08:28:36.088	/legacy/thumb-a3245e0ac548072f0c2db5b486688530_1768059070_121_202x150.png
cmpe74j6j0035gzx1blsqlvj8	JOURNAL	2025	Numerical analysis of absorber tube shapes in PCM-integrated parabolic trough solar collectors	Binit Kumar, Abhishek Awasthi , Jungho Lee , Yongseok Jeon *	Case Studies in Thermal Engineering	https://doi.org/10.1016/j.csite.2025.105783	\N	\N	\N	\N	\N	t	102	2026-05-20 15:07:43.771	2026-06-01 08:28:36.239	/legacy/thumb-36b0db35ca0e5f48e2fa87650c6fc9bc_3CiD9c21_6465bd808e6502af383577869338b9ed682920dc_202x150.jpg
cmpe74j6n0039gzx1eob2ng0q	JOURNAL	2025	Design of Thermal Interface Conductance Measurement System and Validation with ASTM D5470	Byungchan  Hyun,  Su-yoon  Doh,  Jungho  Lee*	The KSFM Journal of Fluid Machinery	\N	\N	\N	\N	\N	\N	t	106	2026-05-20 15:07:43.775	2026-06-01 08:28:36.283	/legacy/thumb-0f3ba66eb9d874349e0f3e4eb0b6cc8b_2WMHm3uq_0fdc32e785ebc2b2e87194c435e519e98a2bd24b_202x150.jpg
cmpe74j6o003bgzx1zuee8dsp	JOURNAL	2025	Boiling heat transfer with a microporous heating surface in a narrow gap with cover plates of different wettability	Aqsa Rukhsar, Dani Fadda, Jungho Lee*, Seung M. You*	International Journal of Heat and Mass Transfer	https://doi.org/10.1016/j.ijheatmasstransfer.2025.126956	\N	\N	\N	\N	\N	t	108	2026-05-20 15:07:43.776	2026-06-01 08:28:36.308	/legacy/thumb-0f3ba66eb9d874349e0f3e4eb0b6cc8b_wP8xanoM_f5499dc6468e2c2117ca08641b8fa5783d1d7253_202x150.jpg
cmpe74j6t003hgzx1gdpjy6bx	JOURNAL	2025	Thermal Performance Analysis of Heat Pipe Small Heat Exchanger Using Porous Media Modeling	Seungjae Lee, Yunseo Kim, JinHyeuk Seo, Dong Hwan Shin, Seong Hyuk Lee, Jungho Lee, Hyoungsoon Lee*	The KSFM Journal of Fluid Machinery	https://doi.org/10.3795/KSME-B.2025.49.6.327	\N	\N	\N	\N	\N	t	114	2026-05-20 15:07:43.781	2026-06-01 08:28:36.418	/legacy/thumb-f7e7e67d261259920248c1638317c7a0_1753407189_0433_202x150.jpg
cmpe74j70003pgzx1rnto563r	JOURNAL	2025	Effect of Tapered Gap Angle and Height on the Thermal Performance of a Two-Phase Cold Plate for High Heat Dissipation	Seokchan Hwang, Junyoung Choi, Jungho Lee*	The KSFM Journal of Fluid Machinery	https://doi.org/10.5293/kfma.2025.28.5.033	\N	\N	\N	\N	\N	t	122	2026-05-20 15:07:43.788	2026-06-01 08:28:36.601	/legacy/thumb-43f12c61db4b65617102a8c4ddc2c139_1763341750_2779_202x150.png
cmpe74j74003ugzx1ehi1hn9c	JOURNAL	2025	Breathable, wearable skin analyzer for reliable long-termmonitoring of skin barrier function and individual environmental health impacts	Insic Hong, Daseul Lim, Dongjin Kim, Myungrae Hong, Sanghun Kang, Kyungbin Ji, TaeukOh, SuhyeonHwang, Yeonwook Roh, Dohyeon Gong, GibeomKwon, Taewi Kim, Chaewan Im, Eunyoung Kim, Jingoo Lee, Seongyeon Kim, Juil Kim, Seunghyun Kim, Kyungmin Shim, Jungho Le	Nature Communications	https://doi.org/10.1038/s41467-025-64207-2	\N	\N	\N	\N	\N	t	127	2026-05-20 15:07:43.792	2026-06-01 08:28:36.632	/legacy/thumb-a3245e0ac548072f0c2db5b486688530_1768059874_3969_202x150.png
cmpe74j68002tgzx1txblngj2	JOURNAL	2024	Thermal performance analysis of heat pipe heat exchanger for effective waste heat recovery	Sukkyung Kang 1, Gyohoon Geum 1, Sehyeon Cho, Daeyoung Kong, Seungjae Lee, JinHyeuk Seo, Dong Hwan Shin, Seong Hyuk Lee, Hyoungsoon Lee*, Jungho Lee*	International Communications in Heat and Mass Transfer	https://doi.org/10.1016/j.icheatmasstransfer.2023.107223	\N	\N	\N	\N	\N	t	90	2026-05-20 15:07:43.76	2026-06-01 08:28:36.646	/legacy/thumb-a85600f146438a9a873aabd3266d4871_nv1hV8Nu_ceb3ccbb0024809a833b7a863508009e164d182c_202x150.jpg
cmpe74j8h0062gzx1wthyrunk	CONFERENCE	2025	Study on Pool Boiling Heat Transfer Performance of Dual-layer Microporous Structures (DMPS)	Su-Yoon Doh, Jungho Lee	\N	\N	2025 대한기계학회 열공학부문 춘계학술대회	\N	\N	\N	\N	t	80	2026-05-20 15:07:43.841	2026-06-01 08:28:36.992	\N
cmpe74j8i0063gzx1572hltcz	CONFERENCE	2025	Boiling-driven Heat Spreader for\v Thermal Management of High-power Server Chips	Su-Yoon Doh, Jungho Lee	\N	\N	2025 한국유체기계학회 하계학술대회	\N	\N	\N	\N	t	81	2026-05-20 15:07:43.842	2026-06-01 08:28:37.009	\N
cmpe74j6d002ygzx14pnqa9ut	JOURNAL	2024	Explicitly defined empirical constant for phase-change simulation in a two-phase closed thermosyphon	Sehyeon Cho, Dayoung Kong, Gyohoon Geum, Seungjae Lee, Junrae Park, Seong Hyuk Lee, Jungho Lee , Hyoungsoon Lee	International Communications in Heat and Mass Transfer	https://doi.org/10.1016/j.icheatmasstransfer.2024.107932	\N	\N	\N	\N	\N	t	95	2026-05-20 15:07:43.765	2026-06-01 08:28:36.738	/legacy/thumb-48cde7be0dc744a4c1fa125f1d61fe2b_Yh84aG5V_c1a280786b2d65ed7cd9a5e8eafddba03c719cdc_202x150.jpg
cmpe74j6h0033gzx19sgph9k9	JOURNAL	2024	Operation Characteristics and Limitations of Small-diameter Two-phase Closed Thermosyphon	Sukkyung Kang ,  Jungho Lee	International Communications in Heat and Mass Transfer	https://doi.org/10.1016/j.icheatmasstransfer.2024.108051	\N	\N	\N	\N	\N	t	100	2026-05-20 15:07:43.769	2026-06-01 08:28:36.789	/legacy/thumb-02ac42d8c7b053493aa60911f12092d5_s4K9uQz1_9b7484b990251dd775b20daf9698dbf0ad8fcb3a_202x150.jpg
cmpe74j64002ogzx1853ic01b	JOURNAL	2023	Thermal performance of a boiling-driven heat spreader using passive flow control	Lim H., Doh S.-Y., Shin D.H., You S.M., Lee J.	Case Studies in Thermal Engineering	https://doi.org/10.1016/j.csite.2022.102604	\N	\N	\N	\N	\N	t	85	2026-05-20 15:07:43.756	2026-06-01 08:28:36.85	/legacy/thumb-c153cb953644731e198e00420b95da9a_B5n0QhRa_9451a97b2305f9f9b9e1ea7c594845b22af79923_202x150.jpg
cmpe74j67002rgzx1oit0v06n	JOURNAL	2023	Experimental and computational investigation of thermal performance and fluid flow in two-phase closed thermosyphon	Sehyeon Cho, Daeyoung Kong, Gyohoon Geum, Sukkyung Kang, Jin Hyeuk Seo, Jun Soo Kim, Seong Hyuk Lee, Jungho Lee, Hyoungsoon Lee	Applied Thermal Engineering	https://doi.org/10.1016/j.applthermaleng.2023.121327	\N	\N	\N	\N	\N	t	88	2026-05-20 15:07:43.759	2026-06-01 08:28:36.904	/legacy/thumb-c153cb953644731e198e00420b95da9a_PN74ohMd_255adc89e14a63e437f05aa5433a58a1a2754d7d_202x150.jpg
cmpe74j62002lgzx1n77bsw5f	JOURNAL	2022	Experimental and numerical investigation of micro-scale effusion and transpiration air cooling on cascaded turbine blades	Kim M., Shin D.H., Lee B.J., Lee J.	Case Studies in Thermal Engineering	https://doi.org/10.1016/j.csite.2022.101892	\N	\N	\N	\N	\N	t	82	2026-05-20 15:07:43.754	2026-06-01 08:28:37.045	/legacy/thumb-c153cb953644731e198e00420b95da9a_bBKhWzep_e5848e1b90ca9d731bd792b25024572b98f5bafd_202x150.jpg
cmpe74j4o000xgzx1vn8ka73z	JOURNAL	2021	Experimental investigation of effusion and transpiration air cooling for single turbine blade	Kim M., Shin D.H., Kim J.S., Lee B.J., Lee J.	Applied Thermal Engineering	https://doi.org/10.1016/j.applthermaleng.2020.116156	\N	\N	\N	\N	\N	t	16	2026-05-20 15:07:43.704	2026-06-01 08:28:37.079	/legacy/thumb-cc61d2e4480b7334f13976d067e6f56f_zTLdUFD8_cf0fc46f9e9277548c51d047564dfd6d85534ff1_202x150.jpg
cmpe74j4r000zgzx19nrzjfia	JOURNAL	2021	Thermal performance of aluminum vapor chamber for EV battery thermal management	Kim J.S., Shin D.H., You S.M., Lee J.	Applied Thermal Engineering	https://doi.org/10.1016/j.applthermaleng.2020.116337	\N	\N	\N	\N	\N	t	18	2026-05-20 15:07:43.707	2026-06-01 08:28:37.102	/legacy/thumb-cc61d2e4480b7334f13976d067e6f56f_DYK5P2GB_b7368979ee972c221d65cf8218bfb51ea3c2ccde_202x150.jpg
cmpe74j4u0012gzx1ls5fxmel	JOURNAL	2021	Effects of materials and microstructures on pool boiling of saturated water from metallic surfaces	Godinez J.C., Cho H., Fadda D., Lee J., Park S.J., You S.M.	International Journal of Thermal Sciences	https://doi.org/10.1016/j.ijthermalsci.2021.106929	\N	\N	\N	\N	\N	t	21	2026-05-20 15:07:43.71	2026-06-01 08:28:37.342	/legacy/thumb-c153cb953644731e198e00420b95da9a_XcspAeOW_d482b76a8aa9f811c2345591778096d61df49e8f_202x150.jpg
cmpe74j4y0017gzx1xhz8j37c	JOURNAL	2021	Dropwise condensation of acetone and ethanol for a high-performance lubricant-impregnated thermosyphon	Seo D., Shim J., Shin D.H., Nam Y., Lee J.	International Journal of Heat and Mass Transfer	https://doi.org/10.1016/j.ijheatmasstransfer.2021.121871	\N	\N	\N	\N	\N	t	26	2026-05-20 15:07:43.714	2026-06-01 08:28:37.39	/legacy/thumb-cc61d2e4480b7334f13976d067e6f56f_nypIzg6N_366fb684973583137167a0de6720a04a100b6943_202x150.jpg
cmpe74j51001agzx1oxrufmig	JOURNAL	2020	Enhanced thermal performance of a thermosyphon for waste heat recovery: Microporous coating at evaporator and hydrophobic coating at condenser	Kim Y., Kim J.S., Shin D.H., You S.M., Lee J.	Applied Thermal Engineering	https://doi.org/10.1016/j.applthermaleng.2020.115332	\N	\N	\N	\N	\N	t	29	2026-05-20 15:07:43.717	2026-06-01 08:28:37.449	/legacy/thumb-cc61d2e4480b7334f13976d067e6f56f_V1Nsjbvc_69556ca9be9e4c30a81128855da6f204d3cfb665_202x150.jpg
cmpe74j8g0060gzx1bu52jgbw	CONFERENCE	2025	텅스텐-액체금속 혼합물의 고정밀 열물성 측정을 위한 개선된 정상상태 방법론	헌병찬, 이정호	\N	\N	2025 대한기계학회 열공학부문 춘계학술대회	\N	\N	\N	\N	t	78	2026-05-20 15:07:43.84	2026-06-01 08:28:36.947	\N
cmpe74j55001fgzx1upi4i5iz	JOURNAL	2019	Effect of sintered microporous coating at the evaporator on the thermal performance of a two-phase closed thermosyphon	Kim Y., Shin D.H., Kim J.S., You S.M., Lee J.	International Journal of Heat and Mass Transfer	https://doi.org/10.1016/j.ijheatmasstransfer.2018.11.134	\N	\N	\N	\N	\N	t	34	2026-05-20 15:07:43.721	2026-06-01 08:28:37.576	/legacy/thumb-cc61d2e4480b7334f13976d067e6f56f_47hyvbaD_0a55a0f9b69b570ff1995df9453c0f0989919a4c_202x150.jpg
cmpe74j59001jgzx1glidx5rt	JOURNAL	2019	A study on 65 % potential efficiency of the gas turbine combined cycle	Kwon H.M., Moon S.W., Kim T.S., Kang D.W., Sohn J.L., Lee J.	Journal of Mechanical Science and Technology	https://doi.org/10.1007/s12206-019-0850-8	\N	\N	\N	\N	\N	t	38	2026-05-20 15:07:43.725	2026-06-01 08:28:37.615	/legacy/thumb-c153cb953644731e198e00420b95da9a_Qwj1kS36_cdf597185a19046fb674c4411d73dd5bde1e5904_202x150.jpg
cmpe74j5a001lgzx1bzvw23jc	JOURNAL	2019	Flow Visualization of Microscale Effusion and Transpiration Cooling on Semi-cylinder for Gas Turbine Cooling Application	Shin D.H., Kim Y., Kim J.S., Kang D.W., Sohn J.-L., Lee J.	Journal of Heat Transfer	https://doi.org/10.1115/1.4044663	\N	\N	\N	\N	\N	t	40	2026-05-20 15:07:43.726	2026-06-01 08:28:37.643	/legacy/thumb-c153cb953644731e198e00420b95da9a_ios82GyF_f99c81382562bb0e38fe274ccd6711d2f6166451_202x150.jpg
cmpe74j5d001pgzx1has0l74b	JOURNAL	2018	Flow Visualization of Axisymmetric Impinging Jet on a Concave Surface	Shin D.H., Kim Y., Kim J.S., Kang D.W., Sohn J.-L., Lee J.	Journal of Heat Transfer	https://doi.org/10.1115/1.4040394	\N	\N	\N	\N	\N	t	44	2026-05-20 15:07:43.729	2026-06-01 08:28:37.691	/legacy/thumb-c153cb953644731e198e00420b95da9a_8G3WV7la_501d617039eeaba14abd32b6493f059798fb5013_202x150.jpg
cmpe74j5g001sgzx1djvj42rd	JOURNAL	2018	Quench subcooled-jet impingement boiling: Two interacting-jet enhancement	Lee S.G., Kaviany M., Lee J.	International Journal of Heat and Mass Transfer	https://doi.org/10.1016/j.ijheatmasstransfer.2018.05.113	\N	\N	\N	\N	\N	t	47	2026-05-20 15:07:43.732	2026-06-01 08:28:37.747	/legacy/thumb-cc61d2e4480b7334f13976d067e6f56f_pvmOjXiS_b27db1b2dbaabaa3a59200fbdd6be87a53da8ad6_202x150.jpg
cmpe74j5i001vgzx1d1lcizju	JOURNAL	2018	Boiling and condensation heat transfer of inclined two-phase closed thermosyphon with various filling ratios	Kim Y., Shin D.H., Kim J.S., You S.M., Lee J.	Applied Thermal Engineering	https://doi.org/10.1016/j.applthermaleng.2018.09.037	\N	\N	\N	\N	\N	t	50	2026-05-20 15:07:43.734	2026-06-01 08:28:37.819	/legacy/thumb-cc61d2e4480b7334f13976d067e6f56f_NmA7S3vX_cf3524cb6a7a755d6850b09591020264de18b76c_202x150.jpg
cmpe74j5m0020gzx1tu7ux2e0	JOURNAL	2017	Visualization of Effusion Cooled Flow within Freestream Boundary Layer	Lee J., Kim J., Lim H., Bang J.S., Seo J.M., Sohn J.L., Lee J.	Journal of Heat Transfer	https://doi.org/10.1115/1.4036882	\N	\N	\N	\N	\N	t	55	2026-05-20 15:07:43.738	2026-06-01 08:28:37.892	/legacy/thumb-c153cb953644731e198e00420b95da9a_XRcdvJbA_50a582fc29e85064cc110c3673b12f2553e33cd2_202x150.jpg
cmpe74j5o0022gzx14dyvogk4	JOURNAL	2017	Flow visualization of microscale effusion cooling within mainstream boundary layer on a flat plate	Lee J., Kim J.S., Lim H., Bang J.S., Seo J.M., Sohn J.L., Lee J.	Journal of Mechanical Science and Technology	https://doi.org/10.1007/s12206-017-1005-4	\N	\N	\N	\N	\N	t	57	2026-05-20 15:07:43.74	2026-06-01 08:28:37.982	/legacy/thumb-c153cb953644731e198e00420b95da9a_rxySCueD_7237d42329677e95b3be34f22ca0b31ce71c97a6_202x150.jpg
cmpe74j5s0027gzx1bwn9g06v	JOURNAL	2016	Simultaneous Boiling Visualization and Heat Transfer Measurement of Two Adjacent Water Impinging Jets	Lee J., Lee S.G.	Journal of Heat Transfer	https://www.scopus.com/inward/record.uri?eid=2-s2.0-85048520338&partnerID=40&md5=1431154033e8718450c468ab3f66c90d	\N	\N	\N	\N	\N	t	62	2026-05-20 15:07:43.744	2026-06-01 08:28:38.043	/legacy/thumb-c153cb953644731e198e00420b95da9a_dNpc3RJi_4223670e09a94f97ce2ae6354abbc038a2d477c8_202x150.jpg
cmpe74j7u004ugzx1h5bg89er	CONFERENCE	2023	휜-관 써모사이폰 열교환기 열성능 예측 프로그램의 개발 및 검증	김규일, 강석경, 서진혁, 이정호	\N	\N	2023년 한국유체기계학회 하계학술대회	\N	\N	\N	\N	t	35	2026-05-20 15:07:43.818	2026-06-01 08:28:37.586	\N
cmpe74j5u002bgzx1o1wrhhm0	JOURNAL	2014~Before	Direct fabrication of thin film gold resistance temperature detection sensors on a curved surface using a flexible dry film photoresist and their calibration up to 450 °c	Ahn C.H., Park H.W., Kim H.H., Park S.H., Son C., Kim M.C., Lee J.H., Go J.S.	Journal of Micromechanics and Microengineering	https://doi.org/10.1088/0960-1317/23/6/065031	\N	\N	\N	\N	\N	t	68	2026-05-20 15:07:43.746	2026-06-01 08:28:38.088	/legacy/thumb-c153cb953644731e198e00420b95da9a_1gOUS9Qy_8e12b6cefa05f304c21a739ee4014accd5f45211_202x150.jpg
cmpe74j8b005rgzx1l9brqp3e	CONFERENCE	2024	Thermal performance of the geothermal thermosyphon for snow melting on paved roads	Hyunmuk Lim, Seokjin Lee, Sukkyung Kang, Jungho Lee	\N	\N	22nd IHPC & 16th IHPS	\N	\N	\N	\N	t	69	2026-05-20 15:07:43.835	2026-06-01 08:28:38.098	\N
cmpe74j8c005ugzx1lctxmawb	CONFERENCE	2024	작동유체 변화에 따른 이상 밀폐 써모사이폰의 가이저 비등 특성 연구	서진혁, 이정호	\N	\N	2024 한국유체기계학회 계학술대회	\N	\N	\N	\N	t	72	2026-05-20 15:07:43.836	2026-06-01 08:28:38.191	\N
cmpe74j7b0040gzx1osoqivhu	CONFERENCE	2022	작동유체가 써모사이폰의 Confinement 효과에 미치는 영향 연구	강석경, 이정호	\N	\N	대한기계학회 열공학부문 2022년도 춘계학술대회	\N	\N	\N	\N	t	5	2026-05-20 15:07:43.799	2026-05-20 15:07:43.799	\N
cmpe74j7c0041gzx1t2yoc8jp	CONFERENCE	2022	마이크로 다공질 구조에 따른 풀비등 성능에 관한 연구	도수윤, 임현묵, 이정호	\N	\N	대한기계학회 열공학부문 2022년도 춘계학술대회	\N	\N	\N	\N	t	6	2026-05-20 15:07:43.8	2026-05-20 15:07:43.8	\N
cmpe74j7d0042gzx1vbi8e3tj	CONFERENCE	2022	OpenFOAM 을 활용한 2 상 밀폐 열사이펀의 가시화 및 온도 분포에 대한 수치적 예측	조세현, 공대영, 금교훈, 김준수, 이형순, 이성혁, 이정호	\N	\N	대한기계학회 열공학부문 2022년도 춘계학술대회	\N	\N	\N	\N	t	7	2026-05-20 15:07:43.801	2026-05-20 15:07:43.801	\N
cmpe74j7e0043gzx16iav8gcm	CONFERENCE	2022	Ceria/Polymer Hybrid Coating for Long-Lasting Superhydrophobic Condensers	Jaehwan Shim, Jun Soo Kim, Seungtae Oh, Jungho Lee, Jungchul Lee, Youngsuk Nam	\N	\N	2022년 한국유체기계학회 하계학술대회	\N	\N	\N	\N	t	8	2026-05-20 15:07:43.802	2026-05-20 15:07:43.802	\N
cmpe74j7e0044gzx1e8okuicg	CONFERENCE	2022	Development of Standard Prototype for Heat-pipe Heat Exchanger and Future Plan	Sukkyung Kang, Jin Hyeuk Seo, Jungho Lee	\N	\N	2022년 한국유체기계학회 하계학술대회	\N	\N	\N	\N	t	9	2026-05-20 15:07:43.802	2026-05-20 15:07:43.802	\N
cmpe74j7f0045gzx1gwp2n66n	CONFERENCE	2022	2상 밀폐 열사이펀의 가시화 및 온도분포 예측모델 개발	조세현, 금교훈, 공대영, 이형순, 이성혁, 이정호	\N	\N	2022년 한국유체기계학회 하계학술대회	\N	\N	\N	\N	t	10	2026-05-20 15:07:43.803	2026-05-20 15:07:43.803	\N
cmpe74j7g0046gzx15gkxkfio	CONFERENCE	2022	고열유속 어플리케이션을 위한 비등기반 히트 스프레더가 내장된 열관리 장치	임현묵, 이정호	\N	\N	2022년 한국유체기계학회 하계학술대회	\N	\N	\N	\N	t	11	2026-05-20 15:07:43.804	2026-05-20 15:07:43.804	\N
cmpe74j7h0047gzx1l3iijhpm	CONFERENCE	2022	히트파이프 제작 시간 단축을 위한 유도가열 기반 작동유체 주입법 연구	서진혁, 신동환, 이정호	\N	\N	2022년 한국유체기계학회 하계학술대회	\N	\N	\N	\N	t	12	2026-05-20 15:07:43.805	2026-05-20 15:07:43.805	\N
cmpe74j7h0048gzx1mun1cbe8	CONFERENCE	2022	마이크로 두께 구리폼의 풀 비등 열전달에 대한 경사각의 영향	도수윤, 이석진, 이정호	\N	\N	2022년 한국유체기계학회 하계학술대회	\N	\N	\N	\N	t	13	2026-05-20 15:07:43.805	2026-05-20 15:07:43.805	\N
cmpe74j7i0049gzx1lw6c8b7b	CONFERENCE	2022	써모사이폰의 Confinement 에 미치는 내경의 영향 연구	강석경, 서진혁, 이정호	\N	\N	대한기계학회 2022년 학술대회	\N	\N	\N	\N	t	14	2026-05-20 15:07:43.806	2026-05-20 15:07:43.806	\N
cmpe74j7i004agzx1exdy9ddw	CONFERENCE	2022	2상 밀폐 열사이펀을 위한 응축 물질 전달 강화 계수 자동 선정 및 형상에 따른 열성능 변화 분석	조세현, 공대영, 금교훈, 이성혁, 이정호, 이형순	\N	\N	대한기계학회 2022년 학술대회	\N	\N	\N	\N	t	15	2026-05-20 15:07:43.806	2026-05-20 15:07:43.806	\N
cmpe74j7j004bgzx14fmpjhem	CONFERENCE	2022	써모사이폰 열교환기 열설계 프로그램 개발	김규일, 강석경, 서진혁, 이정호	\N	\N	대한기계학회 열공학부문 2022년도 춘계학술대회	\N	\N	\N	\N	t	16	2026-05-20 15:07:43.807	2026-06-01 08:28:37.079	\N
cmpe74j7k004cgzx1kmc20sfv	CONFERENCE	2022	마랑고니 효과를 이용한 써모사이폰 내 응축열전달 성능 향상 연구	서진혁, 서동현, 이정호	\N	\N	대한기계학회 2022년 학술대회	\N	\N	\N	\N	t	17	2026-05-20 15:07:43.808	2026-06-01 08:28:37.092	\N
cmpe74j7n004hgzx11kwnqyfy	CONFERENCE	2022	Thermal management device with boiling-driven heat spreader	Lim H., Shin D.H., Rhee G.H., You S.M., Lee J.	\N	\N	38th Annual Semiconductor Thermal Measurement, Modeling and Management Symposium, SEMI-THERM 2022	\N	\N	\N	\N	t	22	2026-05-20 15:07:43.811	2026-06-01 08:28:37.356	\N
cmpe74j7n004igzx1edwogbgx	CONFERENCE	2023	내경이 써모사이폰의 Confinement 효과에 미치는 영향	강석경, 서진혁, 이정호	\N	\N	대한기계학회 열공학부문 2023년도 춘계학술대회	\N	\N	\N	\N	t	23	2026-05-20 15:07:43.811	2026-06-01 08:28:37.365	\N
cmpe74j7o004kgzx1b8bmavy4	CONFERENCE	2023	저온 열원을 이용한 컴팩트형 히트파이프 열교환기 열성능 연구	서진혁, 이정호, 강석경	\N	\N	대한기계학회 열공학부문 2023년도 춘계학술대회	\N	\N	\N	\N	t	25	2026-05-20 15:07:43.812	2026-06-01 08:28:37.381	\N
cmpe74j7p004lgzx1jinhkfj5	CONFERENCE	2023	비등 기반 열전달판 내장형 수랭식 알루미늄 히트 싱크	도수윤, 임현묵, 이정호	\N	\N	대한기계학회 열공학부문 2023년도 춘계학술대회	\N	\N	\N	\N	t	26	2026-05-20 15:07:43.813	2026-06-01 08:28:37.39	\N
cmpe74j7p004mgzx1vmofbhf6	CONFERENCE	2022	Thin Flat Boiling-driven Heat Spreader	Su-Yoon Doh, Hyunmuk Lim, Dong Hwan Shin, Seung M. You, Jungho Lee	\N	\N	International Technical Conference and Exhibition on Packaging and Integration of Electronic and Photonic Microsystems, InterPACK	\N	\N	\N	\N	t	27	2026-05-20 15:07:43.813	2026-06-01 08:28:37.399	\N
cmpe74j7q004ogzx19ugbc7sa	CONFERENCE	2022	The Boiling-Driven Heat Spreader Embedded Device for Thermal Management in High-Power Semiconductor	Hyunmuk Lim, Su-Yoon Doh, Seung M. You, Jungho Lee	\N	\N	International Technical Conference and Exhibition on Packaging and Integration of Electronic and Photonic Microsystems, InterPACK	\N	\N	\N	\N	t	29	2026-05-20 15:07:43.814	2026-06-01 08:28:37.449	\N
cmpe74j7q004pgzx14dstwkuk	CONFERENCE	2023	Thermal performance of wickless boiling-driven heat spreader	Hyunmuk Lim, Su-Yoon Doh, Seung M. You, Jungho Lee	\N	\N	39th Annual Semiconductor Thermal Measurement, Modeling and Management Symposium, SEMI-THERM 2023	\N	\N	\N	\N	t	30	2026-05-20 15:07:43.814	2026-06-01 08:28:37.48	\N
cmpe74j7r004qgzx19wt42i5o	CONFERENCE	2023	Development of the flat plate two-phase heat spreader for high heat loads	Hyunmuk Lim, Su-Yoon Doh, Seung M. You, Jungho Lee	\N	\N	21st International Heat Pipe Conference, IHPC	\N	\N	\N	\N	t	31	2026-05-20 15:07:43.815	2026-06-01 08:28:37.495	\N
cmpe74j7s004sgzx1kqkk6ueq	CONFERENCE	2023	국민생활형 폐열회수용 소형 히트파이프 열교환기 열성능 연구	서진혁, 강석경, 김규일, 이정호	\N	\N	2023년 한국유체기계학회 하계학술대회	\N	\N	\N	\N	t	33	2026-05-20 15:07:43.816	2026-06-01 08:28:37.564	\N
cmpe74j7t004tgzx1lj86vt0z	CONFERENCE	2023	지열을 이용한 제설용 Thermosyphon 열성능 연구	이석진, 강석경, 이정호	\N	\N	2023년 한국유체기계학회 하계학술대회	\N	\N	\N	\N	t	34	2026-05-20 15:07:43.817	2026-06-01 08:28:37.576	\N
cmpe74j7v004vgzx1tjo5ikq7	CONFERENCE	2023	Effect of Inner Diameter on the Thermal Performance Of Two-Phase Closed Thermosyphon	Sukkyung Kang, Jinhyeuk Seo, Jungho Lee	\N	\N	17th International Heat Transfer Conference, IHTC17	\N	\N	\N	\N	t	36	2026-05-20 15:07:43.819	2026-06-01 08:28:37.596	\N
cmpe74j7v004wgzx165u1aq7j	CONFERENCE	2023	Geyser Boiling in Two-Phase Closed Thermosyphon with Small Diameter	Jinhyeuk Seo, Sukkyung Kang, Jungho Lee	\N	\N	17th International Heat Transfer Conference, IHTC17	\N	\N	\N	\N	t	37	2026-05-20 15:07:43.819	2026-06-01 08:28:37.606	\N
cmpe74j7w004ygzx1fkmwg9v0	CONFERENCE	2023	Role of Bubble Pumping On Heat Transfer Enhancement of Boiling-driven Heat Spreader	Jungho Lee	\N	\N	17th International Heat Transfer Conference, IHTC17	\N	\N	\N	\N	t	39	2026-05-20 15:07:43.82	2026-06-01 08:28:37.635	\N
cmpe74j7w004zgzx1fns80n0s	CONFERENCE	2023	고발열 전자장비 열관리 기술 현황 및 데이터센터 열관리 기술 전망	이정호	\N	\N	제1회 전자장비냉각 및 열관리 통합 Workshop	\N	\N	\N	\N	t	40	2026-05-20 15:07:43.82	2026-06-01 08:28:37.643	\N
cmpe74j7x0050gzx1rnlgb3r2	CONFERENCE	2023	Data Center 열관리 기술 현황 및 전망	이정호	\N	\N	2023년 한국유체기계학회 동계학술대회	\N	\N	\N	\N	t	41	2026-05-20 15:07:43.821	2026-06-01 08:28:37.652	\N
cmpe74j7y0052gzx1gu0696om	CONFERENCE	2023	Effect of Sandblasted Surface on the Thermal performance of Two-Phase Closed Thermosyphon	Sukkyung Kang, Seokjin Lee, JinHyeuk Seo, Jungho Lee	\N	\N	2023년 한국유체기계학회 동계학술대회	\N	\N	\N	\N	t	43	2026-05-20 15:07:43.822	2026-06-01 08:28:37.678	\N
cmpe74j7z0054gzx1ja9x6gnq	CONFERENCE	2023	파우치형 리튬이온 전지의 열적 모형 개발에 관한 연구	정찬훈, 박병완, 이정호	\N	\N	2023년 한국유체기계학회 동계학술대회	\N	\N	\N	\N	t	45	2026-05-20 15:07:43.823	2026-06-01 08:28:37.711	\N
cmpe74j8a005qgzx1hdnb65cz	CONFERENCE	2024	Thermal Performance Enhancement of Two-Phase Closed Thermosyphon by Thread Tapping inside the Evaporator	Sukkyung Kang, Seokjin Lee, Jungho Lee	\N	\N	22nd IHPC & 16th IHPS	\N	\N	\N	\N	t	67	2026-05-20 15:07:43.834	2026-05-20 15:07:43.834	\N
cmpe74j8d005wgzx15swhi0an	CONFERENCE	2024	샌드블라스팅 표면이 R245fa 흐름 비등 성능 향상에 미치는 영향 연구	최승우, 도수윤, 이정호	\N	\N	2024 한국유체기계학회 동계학술대회	\N	\N	\N	\N	t	74	2026-05-20 15:07:43.837	2026-05-20 15:07:43.837	\N
cmpe74j8e005xgzx1zv9mol21	CONFERENCE	2024	아세톤 내에서 알루미늄 마이크로다공성 구조의 풀비등 열전달 분석	최준영, 도수윤, 이정호	\N	\N	2024 한국유체기계학회 동계학술대회	\N	\N	\N	\N	t	75	2026-05-20 15:07:43.838	2026-05-20 15:07:43.838	\N
cmpe74j8f005ygzx1qzwxurxs	CONFERENCE	2024	Pool Boiling Heat Transfer Analysis on Aluminum Microporous Structures in Acetone	Junyoung Choi, Su-Yoon Doh, Hyunmuk Lim, Jungho Lee	\N	\N	PRTEC2024	\N	\N	\N	\N	t	76	2026-05-20 15:07:43.839	2026-05-20 15:07:43.839	\N
cmpe74j8g005zgzx1y3h01jck	CONFERENCE	2024	Thermal Characterization of Boiling-Driven Heat Spreader Through Flow Visualization and Thermal Imaging	Jung Chan Moc, Su-Yoon Doh, Jungho Lee	\N	\N	PRTEC2024	\N	\N	\N	\N	t	77	2026-05-20 15:07:43.84	2026-05-20 15:07:43.84	\N
cmpe74j7z0055gzx1ql27689q	CONFERENCE	2023	충진비에 따른 제설·방빙용 Thermosyphon 열성능 연구	이석진, 강석경, 이정호	\N	\N	2023년 한국유체기계학회 동계학술대회	\N	\N	\N	\N	t	46	2026-05-20 15:07:43.823	2026-06-01 08:28:37.726	\N
cmpe74j810057gzx1tuc68o57	CONFERENCE	2023	비등 기반 열전달판의 내부 유동 및 열전달 특성에 관한 연구	도수윤, 임현묵, 이정호	\N	\N	2023년 한국유체기계학회 동계학술대회	\N	\N	\N	\N	t	48	2026-05-20 15:07:43.825	2026-06-01 08:28:37.79	\N
cmpe74j810058gzx1ivjdbb3p	CONFERENCE	2024	알루미늄 마이크로다공질 구조의 아세톤 풀비등 성능 연구	도수윤, 최준영, 이정호	\N	\N	2024년 대한기계학회 열공학부문 춘계학술대회	\N	\N	\N	\N	t	49	2026-05-20 15:07:43.825	2026-06-01 08:28:37.801	\N
cmpe74j82005agzx1xltyir6k	CONFERENCE	2024	Characteristic on spreading thermal resistance of boiling-driven heat spreader	목정찬, 도수윤, 이정호	\N	\N	2024년 대한기계학회 열공학부문 춘계학술대회	\N	\N	\N	\N	t	51	2026-05-20 15:07:43.826	2026-06-01 08:28:37.856	\N
cmpe74j83005bgzx194pzuz7a	CONFERENCE	2024	Comparison of pool boiling performance by copper foam  attachment method	최준영, 도수윤, 이정호	\N	\N	2024년 대한기계학회 열공학부문 춘계학술대회	\N	\N	\N	\N	t	52	2026-05-20 15:07:43.827	2026-06-01 08:28:37.863	\N
cmpe74j84005dgzx1cqgrmmf8	CONFERENCE	2024	Development of 1 RC Model for Calculating Lithium-ion Cell’s Heat Generation	정찬훈, 박병완, 최승우, 신상현, 이정호	\N	\N	2024년 대한기계학회 열공학부문 춘계학술대회	\N	\N	\N	\N	t	54	2026-05-20 15:07:43.828	2026-06-01 08:28:37.88	\N
cmpe74j84005fgzx1ogqozcky	CONFERENCE	2024	Geyser boiling visualization	JinHyeuk Seo, Sukkyung Kang, Seokjin Lee, Jungho Lee	\N	\N	ASME SHTC	\N	\N	\N	\N	t	56	2026-05-20 15:07:43.829	2026-06-01 08:28:37.908	\N
cmpe74j85005hgzx1rskn29na	CONFERENCE	2024	이상 밀폐형 써모사이폰 내 가이저 비등 현상의 압력 및 힘 측정	서진혁, 이정호	\N	\N	2024 한국유체기계학회 하계학술대회	\N	\N	\N	\N	t	58	2026-05-20 15:07:43.829	2026-06-01 08:28:37.995	\N
cmpe74j86005igzx16wwrjhuh	CONFERENCE	2024	Lab-scale 제설용 지열 써모사이폰의 가시화 및 열성능 연구	이석진, 강석경, 이정호	\N	\N	2024 한국유체기계학회 하계학술대회	\N	\N	\N	\N	t	59	2026-05-20 15:07:43.83	2026-06-01 08:28:38.01	\N
cmpe74j87005kgzx1eltms6gu	CONFERENCE	2024	Confinement effect in two-phase closed thermosyphon	강석경, 이정호	\N	\N	2024 한국유체기계학회 하계학술대회	\N	\N	\N	\N	t	61	2026-05-20 15:07:43.831	2026-06-01 08:28:38.029	\N
cmpe74j88005lgzx18ntvhmpm	CONFERENCE	2024	Thermal performance analysis of small heat exchanger using porous media approach	이승재, 김윤서, 서진혁, 이성혁, 이정호, 이형순	\N	\N	2024 한국유체기계학회 하계학술대회	\N	\N	\N	\N	t	62	2026-05-20 15:07:43.832	2026-06-01 08:28:38.043	\N
cmpe74j89005ngzx1a7cihblz	CONFERENCE	2024	Performance evaluation and visualization of the boiling-driven heat spreader	Suyoon Doh, Jungho Lee	\N	\N	Therminic 2024	\N	\N	\N	\N	t	64	2026-05-20 15:07:43.833	2026-06-01 08:28:38.069	\N
cmpe74j89005ogzx1vxzt9jql	CONFERENCE	2024	Spreading Thermal Resistance of Boiling-Driven Heat Spreader	Jung Chan Moc, Su Yoon Doh, Jungho Lee	\N	\N	22nd IHPC & 16th IHPS	\N	\N	\N	\N	t	65	2026-05-20 15:07:43.833	2026-06-01 08:28:38.078	\N
cmpe74j8b005sgzx1cvfzs2wm	CONFERENCE	2024	The aluminum boiling-driven heat spreader	Su-Yoon Doh, Junyoung Choi, Seung M. You, Jungho Lee	\N	\N	22nd IHPC & 16th IHPS	\N	\N	\N	\N	t	70	2026-05-20 15:07:43.835	2026-06-01 08:28:38.126	\N
cmpe74j8b005tgzx1azng99kd	CONFERENCE	2024	Measurement of Impact Force of Geyser Boiling in TwoPhase Closed Thermosyphon	JinHyeuk Seo, Jungho Lee	\N	\N	22nd IHPC & 16th IHPS	\N	\N	\N	\N	t	71	2026-05-20 15:07:43.835	2026-06-01 08:28:38.148	\N
cmpe74j8c005vgzx13hi7vinu	CONFERENCE	2024	증발부 나사산 가공을 통한 이상 밀폐형 써모사이폰의 열성능 향상 연구	강석경, 이석진, 이정호	\N	\N	2024 한국유체기계학회 동계학술대회	\N	\N	\N	\N	t	73	2026-05-20 15:07:43.836	2026-06-01 08:28:38.36	\N
cmpe74j8i0064gzx1ojffpkwk	CONFERENCE	2025	Direct-to-Chip Cooling for High-Power Devices via Pool Boiling in a Tapered Gap Cold Plate	Seok Chan Hwang, Junyoung Choi, Jungho Lee	\N	\N	2025 한국유체기계학회 하계학술대회	\N	\N	\N	\N	t	82	2026-05-20 15:07:43.842	2026-06-01 08:28:37.045	\N
cmpe74j8h0061gzx158uxtiam	CONFERENCE	2025	샌드블라스팅 표면처리를 통한 R245fa 흐름 비등 열전달 향상 연구	최승우, 도수윤, 이정호	\N	\N	2025 대한기계학회 열공학부문 춘계학술대회	\N	\N	\N	\N	t	79	2026-05-20 15:07:43.841	2026-06-01 08:28:36.97	\N
cmpe74j8j0065gzx1hvtrr20l	CONFERENCE	2025	미니채널 내 알루미늄 마이크로 다공성 표면을 이용한 R245fa 유동 비등 성능 향상 연구	최승우, 이정호	\N	\N	2025 한국유체기계학회 하계학술대회	\N	\N	\N	\N	t	83	2026-05-20 15:07:43.843	2026-06-01 08:28:37.056	\N
cmpe74j7k004dgzx1et098i56	CONFERENCE	2022	폐열회수 향상을 위한 히트파이프 열교환기 열 성능 분석	금교훈, 공대영, 조세현, 이형순, 이성혁, 이정호	\N	\N	대한기계학회 2022년 학술대회	\N	\N	\N	\N	t	18	2026-05-20 15:07:43.808	2026-06-01 08:28:37.102	\N
cmpe74j7m004ggzx13j7g6gdh	CONFERENCE	2022	동일 체적의 비등기반 상변화 열전달판과 베이퍼 챔버의 열성능 비교	도수윤, 임현묵, 이정호	\N	\N	2022년 한국유체기계학회 동계학술대회	\N	\N	\N	\N	t	21	2026-05-20 15:07:43.81	2026-06-01 08:28:37.342	\N
cmpe74j7o004jgzx17jdt8li5	CONFERENCE	2023	다공성 매체 모델을 이용한 비등파이프 열교환기 내부 형상에 따른 열수력학적 성능변화  예측	김윤서, 이승재, 금교훈, 이형순, 이성혁, 신동환, 강석경, 이정호	\N	\N	대한기계학회 열공학부문 2023년도 춘계학술대회	\N	\N	\N	\N	t	24	2026-05-20 15:07:43.812	2026-06-01 08:28:37.372	\N
cmpe74j7p004ngzx1vack97j9	CONFERENCE	2023	Pool Boiling Heat Transfer Characteristics of Micro-Thick Copper Foam	Su-Yoon Doh, Hyunmuk Lim, Jungho Lee	\N	\N	11th International Conference On Boiling & Condensation Heat Transfer, ICBCHT	\N	\N	\N	\N	t	28	2026-05-20 15:07:43.813	2026-06-01 08:28:37.438	\N
cmpe74j7r004rgzx11g8gftda	CONFERENCE	2023	마이크로 두께 구리 폼의 풀비등 열전달에 대한 PPI의 영향	도수윤, 임현묵, 이정호	\N	\N	2023년 한국유체기계학회 하계학술대회	\N	\N	\N	\N	t	32	2026-05-20 15:07:43.815	2026-06-01 08:28:37.506	\N
cmpe74j7w004xgzx1h2cdz0fm	CONFERENCE	2023	Pool Boiling Heat Transfer Enhancement by Surface Modification Using the Micro-Thick Metallic Foam	Hyunmuk Lim, Su-Yoon Doh, Seung M. You, Jungho Lee	\N	\N	17th International Heat Transfer Conference, IHTC17	\N	\N	\N	\N	t	38	2026-05-20 15:07:43.82	2026-06-01 08:28:37.615	\N
cmpe74j7x0051gzx1d86e66kn	CONFERENCE	2023	Visulization and thermal performance of geyser boiling in two-phase closed thermosyphone(TPCT)	JinHyeuk Seo, Sukkyung Kang, Jungho Lee	\N	\N	2023년 한국유체기계학회 동계학술대회	\N	\N	\N	\N	t	42	2026-05-20 15:07:43.821	2026-06-01 08:28:37.664	\N
cmpe74j7y0053gzx1jyr7czzy	CONFERENCE	2023	Thermal performance analysis of heat pipe heat exchanger using porous media approach	Seungjae Lee, Yunseo Kim, Gyohoon Geum, Sukkyung Kang, Dong Hwan Shin, Seong Hyunk Lee, Jungho Lee, Hyoungsoon Lee	\N	\N	2023년 한국유체기계학회 동계학술대회	\N	\N	\N	\N	t	44	2026-05-20 15:07:43.822	2026-06-01 08:28:37.691	\N
cmpe74j800056gzx1telgyu6o	CONFERENCE	2023	공극률에 따른 마이크로 두께 구리폼의 풀비등 성능에 대한 연구	최준영, 도수윤, 임현묵, 이정호	\N	\N	2023년 한국유체기계학회 동계학술대회	\N	\N	\N	\N	t	47	2026-05-20 15:07:43.824	2026-06-01 08:28:37.747	\N
cmpe74j820059gzx1a456le3r	CONFERENCE	2024	2상 액침냉각에서 표면 개질에 따른 열성능 비교 연구	신상현, 도수윤, 이정호	\N	\N	2024년 대한기계학회 열공학부문 춘계학술대회	\N	\N	\N	\N	t	50	2026-05-20 15:07:43.826	2026-06-01 08:28:37.819	\N
cmpe74j83005cgzx1cv7ffstz	CONFERENCE	2024	Design of a thermal interface conductance measurement  system and validation with ASTM D5470	현병찬, 도수윤, 이정호	\N	\N	2024년 대한기계학회 열공학부문 춘계학술대회	\N	\N	\N	\N	t	53	2026-05-20 15:07:43.827	2026-06-01 08:28:37.871	\N
cmpe74j85005ggzx1f3s47kfs	CONFERENCE	2024	샌드블라스팅 표면의 흐름 비등 열전달과 압력강하 특성 분석에 대한 실험적 연구	최승우, 도수윤, 이정호	\N	\N	2024 한국유체기계학회 하계학술대회	\N	\N	\N	\N	t	57	2026-05-20 15:07:43.829	2026-06-01 08:28:37.982	\N
cmpe74j87005jgzx1lbumspp4	CONFERENCE	2024	2상 액침냉각의 여러 열원 간의 상호 작용 연구	신상현, 도수윤, 이정호	\N	\N	2024 한국유체기계학회 하계학술대회	\N	\N	\N	\N	t	60	2026-05-20 15:07:43.831	2026-06-01 08:28:38.019	\N
cmpe74j88005mgzx1xjog7dua	CONFERENCE	2024	구리 파우더를 이용한 고열전도성 열계면물질 제조	현병찬, 도수윤, 이정호	\N	\N	2024 한국유체기계학회 하계학술대회	\N	\N	\N	\N	t	63	2026-05-20 15:07:43.832	2026-06-01 08:28:38.053	\N
cmpe74j8q006egzx1m6oat2da	PATENT	2023	Heat-pipe type heat exchanger	\N	\N	\N	\N	Jungho Lee, Rakyeong Yang, Sukkyung Kang, Su-Yoon Doh	22 877 346.1	European Patent Office (EPO)	2023-04-07	t	10	2026-05-20 15:07:43.85	2026-05-20 15:07:43.85	\N
cmpe74j8r006fgzx1hnfmxl30	PATENT	2024	Apparatus for heat pipe inside coating	\N	\N	\N	\N	Jungho Lee, Rakyeong Yang	10-2024-0026191	Republic of Korea	2024-02-23	t	11	2026-05-20 15:07:43.851	2026-05-20 15:07:43.851	\N
cmpe74j8r006ggzx13hxgbw3l	PATENT	2024	Liquid immersion cooling device for data centers	\N	\N	\N	\N	Jungho Lee	10-2024-0047498	Republic of Korea	2024-04-08	t	12	2026-05-20 15:07:43.851	2026-05-20 15:07:43.851	\N
\.


--
-- Data for Name: ResearchTopic; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ResearchTopic" (id, num, title, lead, keywords, bg, published, "order", "createdAt", "updatedAt") FROM stdin;
cmpv1c16u000prnx1mi6g8df7	03	Thermosyphon and Waste Heat Recovery	Two-phase passive devices for compact electronics, HVAC energy recovery, and seasonal anti-icing — built around thermosyphon and heat-pipe physics.	{Thermosyphon,TPCT,"Heat-Pipe HX","Waste Heat",Geothermal}	white	t	2	2026-06-01 09:57:40.998	2026-06-01 09:57:40.998
cmpv1c1730011rnx11h94vd3t	04	TGP (Boiling-Driven Heat Spreader)	Planar phase-change heat spreaders that move concentrated chip-level heat fluxes — developed in collaboration with UT Dallas since 2014.	{"Vapor Chamber",BDHS,"Heat Spreader","Bubble Pumping","300 W/cm²"}	bg	t	3	2026-06-01 09:57:41.007	2026-06-01 09:57:41.007
cmpv1c1600001rnx11rb5z8co	01	Phase-Change Heat Transfer	Fundamental and applied studies on pool and flow boiling, surface engineering, and the physics that governs nucleate-boiling heat transfer and critical heat flux.	{"Pool Boiling","Flow Boiling","Microporous Surfaces",CHF,HTC}	white	t	0	2026-06-23 04:30:17.035	2026-06-25 12:46:16.818
cmpv1c16m000irnx159j5m0dh	02	Data Center Thermal Management	Cooling architectures for AI/HPC data centers — from chiller-free immersion baths to two-phase cold plates that follow the chip.	{"Immersion Cooling",Direct-to-Chip,"Cold Plate",PUE,"Dielectric Fluids"}	bg	t	1	2026-06-01 09:57:40.99	2026-06-25 12:46:16.821
\.


--
-- Data for Name: ResearchSubsection; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ResearchSubsection" (id, "topicId", num, title, body, keywords, published, "order", "createdAt", "updatedAt") FROM stdin;
cmpv1c16n000jrnx116mfpfqj	cmpv1c16m000irnx159j5m0dh	02.01	Immersion Cooling: Single-phase	Single-phase immersion cooling is generally employed as a thermal management technique in which IT equipment is directly submerged in electrically insulating dielectric fluid to dissipate heat. In this study, by positioning the evaporator section of a heat pipe heat exchanger within a single-phase immersion bath, the thermal energy extracted from the immersion-cooled system is passively transferred to the condenser section of the heat pipe. As a result, unlike conventional single-phase immersion cooling systems, the proposed configuration eliminates the need for external chillers and circulation pumps, thereby significantly reducing the operational energy consumption associated with single-phase immersion cooling. In this manner, the requirement for coolant circulation is removed, and chiller-free operation becomes feasible, allowing the system to establish itself as a highly efficient thermal management solution. Our laboratory is continuously conducting research to compare the thermal performance of conventional single-phase immersion cooling systems with that of single-phase immersion cooling integrated with heat pipe heat exchangers, with the ultimate goal of reducing the Power Usage Effectiveness (PUE) of data centers.	{Single-phase,Chiller-free,PUE}	t	0	2026-06-01 09:57:40.99	2026-06-01 09:57:40.99
cmpv1c16o000lrnx1b0yqex60	cmpv1c16m000irnx159j5m0dh	02.02	Immersion Cooling: Two-phase Immersion	For research on two-phase immersion cooling, a non-conductive experimental chamber has been constructed to evaluate boiling heat transfer performance in dielectric fluids. Studies are being conducted on enhancing the convective heat transfer coefficient and the critical heat flux by applying microporous surfaces. In addition, the mutual thermal interactions among individual heat sources in two-phase immersion cooling systems are analyzed to develop more practical and applicable cooling strategies for real-world data center environments.	{Two-phase,"Dielectric Fluid",Multi-heater}	t	1	2026-06-01 09:57:40.99	2026-06-01 09:57:40.99
cmpv1c16p000nrnx109cma55u	cmpv1c16m000irnx159j5m0dh	02.03	Direct Liquid Cooling: Jet Impingement, Hybrid Boiling Cold Plate	As the performance of AI and high-performance computing (HPC) hardware continues to increase, energy consumption in data centers is rising rapidly, accompanied by a significant increase in heat generation from server processing units. To address these challenges simultaneously, direct-to-chip (DTC) cooling approaches are being investigated, as they offer high cooling performance capable of substantially mitigating both energy consumption and thermal issues. The in-house developed two-phase flow testbed is equipped with precise flow-rate control and advanced instrumentation, enabling accurate evaluation of cooling performance under conditions closely representative of real operating environments. The Hybrid Boiling Cold Plate (HBCP) under development employs a two-phase cooling strategy that integrates pool boiling and flow boiling, making it well suited for cooling high-heat-flux chipsets while consuming exceptionally low pumping power. Ongoing research focuses on optimizing the design parameters of the HBCP to delay dryout onset and further enhance the thermal performance of the cold plate.	{Direct-to-Chip,HBCP,AI/HPC}	t	2	2026-06-01 09:57:40.99	2026-06-01 09:57:40.99
cmpv1c16u000qrnx18n7g3b9f	cmpv1c16u000prnx1mi6g8df7	03.01	Heat Transfer Enhancement in Thermosyphon: Confinement Effect	With the ongoing miniaturization of electronic devices and energy systems, along with the trend toward higher heat fluxes, demand for compact two-phase closed thermosyphons (TPCTs) has been steadily increasing. Due to the small diameters of compact TPCTs, confinement effects that hinder internal two-phase flow may occur, potentially disrupting stable TPCT operation. In general, the onset of confinement in TPCTs can lead to a severe degradation in thermal performance. Our research has primarily focused on analyzing flow instability phenomena and heat transfer characteristics of TPCTs across a wide range of geometries (inner diameters of 5–25 mm) and working fluids (water, acetone, ethanol, and HFE-7100). As a key outcome, this study is the first to demonstrate that stable operation can be achieved when both the confinement number (Co) and the Froude number (Fr) are less than 0.3.	{TPCT,Confinement,"Co–Fr Map"}	t	0	2026-06-01 09:57:40.998	2026-06-01 09:57:40.998
cmpv1c16v000srnx1lsa12sju	cmpv1c16u000prnx1mi6g8df7	03.02	Heat Transfer Enhancement in Thermosyphon: Geyser Boiling	Geyser boiling is a well-known instability in two-phase closed thermosyphons (TPCTs), characterized by the rapid growth of vapor bubbles that displace the liquid column and generate impulsive impacts at the upper section. Such behavior can shorten the service life of TPCTs and induce fatigue failure, underscoring the need for a more accurate understanding of its onset conditions and underlying mechanisms. Accordingly, this study analyzes Geyser boiling dynamics through flow visualization. It quantitatively measures the impact force of the displaced liquid during Geyser boiling events by installing a load cell at the end of the condenser section of the TPCT. The results indicate that Geyser boiling occurs more readily under high filling ratio conditions (FR > 75%), and that the cumulative loading resulting from repetitive impacts can have a significant influence on equipment fatigue and operational stability. Furthermore, this work provides practical design guidelines for avoiding Geyser boiling and ensuring structural durability during the TPCT design stage.	{"Geyser Boiling","Load Cell","Filling Ratio"}	t	1	2026-06-01 09:57:40.998	2026-06-01 09:57:40.998
cmpv1c16w000urnx1zbvlcdw3	cmpv1c16u000prnx1mi6g8df7	03.03	Gas-to-Liquid, Gas-to-Air Heat Pipe Heat Exchanger	A heat-pipe heat exchanger (HPHX) is a thermal exchange device that efficiently transfers heat by employing an array of heat pipes. Operating on the principle of phase change of the working fluid, heat-pipe heat exchangers exhibit exceptionally high thermal performance, enabling superior energy efficiency. Moreover, owing to the intrinsic isothermal characteristics within a heat pipe, the temperature gradient between the evaporator and condenser sections remains relatively small, which imparts excellent thermal robustness and durability when deployed as a heat exchanger. Building upon these advantages, our research focuses on developing fabrication-friendly strategies to maximize the performance of gas-to-liquid and gas-to-air heat-pipe heat exchangers for the recovery of industrial waste heat. In particular, our efforts are primarily directed toward modifying the internal metallic surfaces of the evaporator section to reduce thermal resistance and further enhance thermal performance.	{HPHX,Gas-to-Liquid,"Waste Heat"}	t	2	2026-06-01 09:57:40.998	2026-06-01 09:57:40.998
cmpv1c16x000wrnx12xjdhyqf	cmpv1c16u000prnx1mi6g8df7	03.04	Wrap-around HPHX	The wrap-around loop heat pipe heat exchanger can be utilized as an energy-saving device in HVAC systems. When a wrap-around loop heat pipe heat exchanger is installed in a configuration that wraps around a chiller, the wrap-around loop heat pipe heat exchanger transfers heat from the upstream side to the downstream side after the chiller. Consequently, it eliminates the need for electric reheaters to compensate for the temperature drop downstream of the chiller in conventional HVAC systems, making it a highly energy-efficient heat exchange solution. In our laboratory, studies are being conducted to analyze the system-level suitability and operational characteristics of the heat exchanger as a function of the working fluid employed (water, ethanol, acetone, and R-1233zd(E)). The results indicate that among the working fluids tested, water exhibits the best overall performance, while R-1233zd(E) also demonstrates relatively favorable performance.	{HVAC,Wrap-around,R-1233zd(E)}	t	3	2026-06-01 09:57:40.998	2026-06-01 09:57:40.998
cmpv1c16y000yrnx13z0hvx9e	cmpv1c16u000prnx1mi6g8df7	03.05	Geothermal Thermosyphon	A geothermal thermosyphon is a passive phase-change heat transfer device that utilizes geothermal energy to enable snow melting and prevent re-freezing without external power input. Research and development are currently underway to ensure effective operation not only during winter conditions but throughout all seasons. In this laboratory, the snow-melting performance of the geothermal thermosyphon is being experimentally validated under conditions that simulate real-world snow removal and anti-icing environments.	{Geothermal,"Snow Melting",Anti-icing}	t	4	2026-06-01 09:57:40.998	2026-06-01 09:57:40.998
cmpv1c1740012rnx18zd4w0gf	cmpv1c1730011rnx11h94vd3t	04.01	Vapor Chamber	A vapor chamber is a planar phase-change heat transfer device designed for efficient cooling by rapidly spreading heat through latent heat transfer. Fabricated from various metallic materials, including aluminum, it facilitates rapid thermal dissipation via internal evaporation and condensation cycles. Operating as a passive heat transfer mechanism that requires no external power, it serves as a viable thermal management solution for high-power electronic devices. Our laboratory is currently focusing on the development of lightweight vapor chambers, primarily utilizing aluminum as the substrate material.	{"Vapor Chamber",Aluminum,Passive}	t	0	2026-06-01 09:57:41.007	2026-06-01 09:57:41.007
cmpv1c1750014rnx1nf1jj1yh	cmpv1c1730011rnx11h94vd3t	04.02	Boiling-Driven Heat Spreader (BDHS)	Unlike conventional vapor chambers known as flat-plate heat pipes, the Boiling-driven Heat Spreader (BDHS) is a phase-change thermal device that dissipates concentrated heat primarily through boiling heat transfer rather than simple internal evaporation and condensation. Joint R&D for this technology has been conducted since 2014 in collaboration with Prof. Seung Mun You's research group at the University of Texas at Dallas. A key characteristic of the BDHS is its orientation-independent thermal performance, allowing effective cooling for concentrated heat sources with high heat fluxes up to 300 W/cm². The BDHS operates effectively under high heat flux conditions by circulating internal fluids through the "bubble pumping" effect induced by boiling heat transfer. With the recent expansion of high-density data centers, liquid cooling technologies are increasingly being adopted, and this laboratory is developing technologies to apply the BDHS developed in-house to cold plates for liquid cooling systems. In parallel, BDHSs designed for large-area and high-heat-flux heat sources are being continuously developed for applications in server chips requiring high-performance cooling.	{BDHS,"Bubble Pumping","300 W/cm²","UT Dallas"}	t	1	2026-06-01 09:57:41.007	2026-06-01 09:57:41.007
cmpv1c1670006rnx1gwvzytnn	cmpv1c1600001rnx11rb5z8co	01.02	Pool Boiling Experimental Apparatus	The present pool boiling experimental apparatus is designed to enable the observation of boiling phenomena under well-controlled and rigorously defined conditions. The pool boiling chamber is designed and fabricated to minimize heat losses to the surroundings while maintaining stable pool boiling conditions. A comprehensive performance analysis of the pool boiling behavior is conducted using high-precision instrumentation, including a high-speed camera, an accurate temperature control system, and dedicated power supply equipment.	{"Test Chamber","High-speed Imaging"}	t	1	2026-06-23 04:30:17.035	2026-06-23 04:30:17.035
cmpv1c1670008rnx1jmvjy5rj	cmpv1c1600001rnx11rb5z8co	01.03	Flow Boiling Experimental Apparatus	The present flow boiling experimental facility is characterized by the following features. Refrigerant circulation is driven by a gear pump, while impurities are removed via an in-line filter, and the mass flow rate is accurately measured using a Coriolis mass flow meter. The inlet temperature is precisely controlled by a subcooler, and after passing through the test section, the working fluid is re-condensed in a plate-type heat exchanger, thereby completing the circulation loop. The system is configured as a fully sealed closed-loop circuit, in which the saturation pressure is regulated through a cooling coil installed inside the reservoir tank. Even when the test section is isolated, a bypass loop ensures the continuous maintenance of a closed-loop operation. Prior to refrigerant charging, it is essential to evacuate the loop under vacuum to completely remove any non-condensable gases from the system, as their presence can significantly affect flow boiling performance and measurement accuracy.	{Closed-loop,"Coriolis Flow Meter",Refrigerant}	t	2	2026-06-23 04:30:17.035	2026-06-23 04:30:17.035
cmpv1c1610002rnx1az890ikf	cmpv1c1600001rnx11rb5z8co	01.01	Pool Boiling	Pool boiling refers to a heat transfer phenomenon that occurs when a horizontal surface immersed in a quiescent fluid is heated, where heat is transferred through natural convection driven by buoyancy-induced density differences as well as through the nucleation, growth, and detachment of vapor bubbles. It denotes a boiling process in which fluid motion is generated solely by natural convection, in the absence of any externally imposed forced flow.                          .         Boiling is generally classified into four distinct regimes: natural convection boiling, nucleate boiling, transition boiling, and film boiling. Among these, the Onset of Nucleate Boiling (ONB), Heat Transfer Coefficient (HTC), and Critical Heat Flux (CHF) are regarded as the key governing parameters.	{ONB,HTC,CHF,"Boiling Regimes"}	t	0	2026-06-23 04:30:17.035	2026-06-24 11:02:39.406
cmpv1c168000arnx18ubs01uy	cmpv1c1600001rnx11rb5z8co	01.04	Flow Boiling Enhancement: by Sandblasting	In the present study, sandblasting was employed to tailor the surface roughness, wherein surface textures were generated through high-pressure abrasive particle impingement. Stainless steel (SUS) wire-cut abrasive media with particle sizes of 0.2, 0.4, and 0.6 mm were used to establish distinct roughness conditions. As the particle size increased, both the depth and lateral scale of surface asperities became more pronounced, resulting in an overall increase in surface roughness. The flow boiling experiments revealed that surfaces treated with larger abrasive particles exhibited superior heat transfer performance. This enhancement is attributed to an increased density of active nucleation sites and a rise in surface energy, which promote the formation of smaller and more uniformly distributed vapor bubbles, ultimately leading to a significant enhancement of flow boiling heat transfer.	{Sandblasting,"Surface Roughness","Nucleation Sites"}	t	3	2026-06-23 04:30:17.035	2026-06-23 04:30:17.035
cmpv1c169000crnx1k40qekh2	cmpv1c1600001rnx11rb5z8co	01.05	Surface Characterization on Metal Surfaces	The microporous surfaces employed in this study are capable of enhancing nucleate boiling heat transfer by suppressing vapor film formation and inducing capillary-driven liquid transport, thereby significantly improving pool boiling heat transfer performance. Micro-thick metallic foam (MMF), characterized by its high porosity and interconnected ligament network, effectively promotes both nucleate boiling activity and continuous liquid replenishment to the heated surface. The dual-layer microporous structure, formed by stacking MMF onto a baseline substrate, facilitates efficient vapor evacuation while simultaneously strengthening capillary flow, leading to improved boiling stability and heat transfer. The mixed-size sintered copper powder surface, fabricated by combining copper powders of varying diameters, generates a dual-scale pore architecture, which enables the simultaneous enhancement of the heat transfer coefficient (HTC) and the critical heat flux (CHF).	{MMF,"Sintered Cu","Dual-scale Pores"}	t	4	2026-06-23 04:30:17.035	2026-06-23 04:30:17.035
cmpv1c16a000ernx17lv4c9jt	cmpv1c1600001rnx11rb5z8co	01.06	Hybrid Microporous Surface Characterization on Metal Surfaces	Cross-sectional scanning electron microscopy (SEM) imaging enables a detailed visual analysis of the pore size distribution, layer thickness, and interfacial bonding quality of the microporous structures. To quantitatively characterize the surface properties, time-resolved contact angle measurements are performed, allowing for the evaluation of the wettability and surface energy of the working fluid on the engineered surfaces. The wicking performance is assessed based on the droplet spreading dynamics, through which the surface capillary transport behavior and liquid replenishment capability can be quantitatively evaluated.	{SEM,"Contact Angle",Wicking}	t	5	2026-06-23 04:30:17.035	2026-06-23 04:30:17.035
cmpv1c16b000grnx130892mcp	cmpv1c1600001rnx11rb5z8co	01.07	Typical Results on Pool Boiling Heat Transfer	Because aluminum readily reacts with water, which is otherwise an effective working fluid, acetone, possessing a high latent heat of vaporization, is predominantly employed as the working fluid for phase-change heat transfer applications involving aluminum surfaces. In this study, a microporous structure was fabricated via aluminum particle brazing, and the resulting surface was utilized to enhance boiling heat transfer performance significantly. Compared with previous studies employing either aluminum surfaces or acetone as the working fluid, the present results demonstrate substantially lower wall superheat and a markedly higher critical heat flux (CHF), thereby confirming the superior thermal performance of the aluminum–acetone combination. Furthermore, based on the experimental data, an empirical correlation was developed to predict the pool boiling CHF as a function of the coating parameters of the microporous surface.	{Aluminum,Acetone,"CHF Correlation"}	t	6	2026-06-23 04:30:17.035	2026-06-23 04:30:17.035
\.


--
-- Data for Name: ResearchFigure; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ResearchFigure" (id, "subsectionId", "imgPath", caption, width, height, "order", "createdAt", "updatedAt", wide) FROM stdin;
cmpv1c16o000krnx1uiy1d5ce	cmpv1c16n000jrnx116mfpfqj	/legacy/a3245e0ac548072f0c2db5b486688530_1768042845_4086.png	Fig. 2.1 — Single-phase immersion cooling loop with a heat-pipe heat exchanger: chiller/pump schematic and the immersion bath integrating the HPHX.	658	208	0	2026-06-01 09:57:40.99	2026-06-01 09:57:41.592	f
cmpv1c16p000mrnx1l3vfwcme	cmpv1c16o000lrnx1b0yqex60	/legacy/a3245e0ac548072f0c2db5b486688530_1768042605_9058.png	Fig. 2.2 — Two-phase immersion chamber: dielectric-fluid boiling curves for copper-foam surfaces of varying thickness, with the corresponding surface micrographs.	658	268	0	2026-06-01 09:57:40.99	2026-06-01 09:57:41.593	f
cmpv1c16p000ornx1d0li9ckc	cmpv1c16p000nrnx109cma55u	/legacy/a3245e0ac548072f0c2db5b486688530_1768042405_4715.png	Fig. 2.3 — Direct-to-chip cold plates (hybrid boiling and jet impingement) on a two-phase flow testbed, with thermal resistance versus power for several designs.	658	222	0	2026-06-01 09:57:40.99	2026-06-01 09:57:41.594	f
cmpv1c16v000rrnx1g68pyp62	cmpv1c16u000qrnx18n7g3b9f	/legacy/a3245e0ac548072f0c2db5b486688530_1768045468_8378.png	Fig. 3.1 — Confinement in compact TPCTs: high-speed visualization of confined bubble/slug flow and a Co–Fr stability map across working fluids and diameters.	514	225	0	2026-06-01 09:57:40.998	2026-06-01 09:57:41.596	f
cmpv1c16w000trnx1o0iuvg28	cmpv1c16v000srnx1lsa12sju	/legacy/a3245e0ac548072f0c2db5b486688530_1768045485_6477.png	Fig. 3.2 — Geyser boiling in a TPCT: high-speed visualization with synchronized load-cell force and pressure traces of the impulsive impacts.	514	212	0	2026-06-01 09:57:40.998	2026-06-01 09:57:41.598	f
cmpv1c16x000vrnx1kzdehkyc	cmpv1c16w000urnx1zbvlcdw3	/legacy/a3245e0ac548072f0c2db5b486688530_1768045504_7002.png	Fig. 3.3 — Heat-pipe heat exchangers (copper and SUS347 bundles) with induction-based fabrication and evaporator surface-modification micrographs.	514	273	0	2026-06-01 09:57:40.998	2026-06-01 09:57:41.599	f
cmpv1c16y000xrnx1xw3m3nqf	cmpv1c16x000wrnx12xjdhyqf	/legacy/a3245e0ac548072f0c2db5b486688530_1768045524_4429.png	Fig. 3.4 — Wrap-around heat-pipe heat exchanger for HVAC energy recovery: operating principle, test rig, and thermal resistance for four working fluids.	514	413	0	2026-06-01 09:57:40.998	2026-06-01 09:57:41.6	f
cmpv1c170000zrnx1s5v02532	cmpv1c16y000yrnx13z0hvx9e	/legacy/a3245e0ac548072f0c2db5b486688530_1768045542_8271.png	Fig. 3.5a — Geothermal thermosyphon for snow melting: operating concept (subsurface heat carried to the surface) and the laboratory test apparatus.	514	248	0	2026-06-01 09:57:40.998	2026-06-01 09:57:41.6	f
cmpv1c1700010rnx1ykd3dhb8	cmpv1c16y000yrnx13z0hvx9e	/legacy/a3245e0ac548072f0c2db5b486688530_1768054776_8083.gif	Fig. 3.5b — Snow-melting demonstration of the geothermal thermosyphon under simulated snowfall.	500	281	1	2026-06-01 09:57:40.998	2026-06-01 09:57:41.601	f
cmpv1c1750013rnx10u26towa	cmpv1c1740012rnx18zd4w0gf	/legacy/bd91ad37e825b45ae7ca8f0c845e4061_1768192783_0653.png	Fig. 4.1 — Lightweight aluminum vapor chamber: prototype plate and junction-temperature response marking boiling incipience and dryout.	514	155	0	2026-06-01 09:57:41.007	2026-06-01 09:57:41.602	f
cmpv1c1750015rnx1sh94n3bj	cmpv1c1750014rnx1nf1jj1yh	/legacy/bd91ad37e825b45ae7ca8f0c845e4061_1768193378_0299.png	Fig. 4.2a — Boiling-Driven Heat Spreader construction (top and bottom plates with boiling-enhancement structure) and its thermal resistance versus heat flux against a vapor chamber.	514	223	0	2026-06-01 09:57:41.007	2026-06-01 09:57:41.603	f
cmpv1c1750016rnx13fq5jb7z	cmpv1c1750014rnx1nf1jj1yh	/legacy/bd91ad37e825b45ae7ca8f0c845e4061_1768193387_2279.gif	Fig. 4.2b — Orientation-independent operation of the BDHS demonstrated across mounting angles.	320	320	1	2026-06-01 09:57:41.007	2026-06-01 09:57:41.604	f
cmpv1c1750017rnx1u1u2g9ji	cmpv1c1750014rnx1nf1jj1yh	/legacy/bd91ad37e825b45ae7ca8f0c845e4061_1768193395_6866.png	Fig. 4.2c — BDHS integrated into a liquid-cooling cold plate: exploded assembly and thermal performance across heat flux and filling ratios.	514	160	2	2026-06-01 09:57:41.007	2026-06-01 09:57:41.605	f
cmpv1c1670007rnx12jt5480a	cmpv1c1670006rnx1gwvzytnn	/legacy/a3245e0ac548072f0c2db5b486688530_1768040653_0039.png	Fig. 1.2 — Pool boiling test facility: chamber cross-section, high-speed visualization system, and data-acquisition and power-supply equipment.	1175	471	0	2026-06-23 04:30:17.035	2026-06-23 04:30:17.035	f
cmpv1c1680009rnx1acv7yccx	cmpv1c1670008rnx1jmvjy5rj	/legacy/a3245e0ac548072f0c2db5b486688530_1768040811_5223.png	Fig. 1.3 — Closed-loop refrigerant flow-boiling facility: process schematic and the assembled rig (gear pump, Coriolis flow meter, sub-cooler, test section).	1175	356	0	2026-06-23 04:30:17.035	2026-06-23 04:30:17.035	f
cmpv1c169000brnx1uxvxkg07	cmpv1c168000arnx18ubs01uy	/legacy/a3245e0ac548072f0c2db5b486688530_1768040334_4402.png	Fig. 1.4 — Sandblasted surfaces produced with 0.2, 0.4, and 0.6 mm SUS wire-cut media, showing roughness increasing with particle size.	1175	350	0	2026-06-23 04:30:17.035	2026-06-23 04:30:17.035	f
cmpv1c16a000drnx1ww5b39a5	cmpv1c169000crnx1k40qekh2	/legacy/a3245e0ac548072f0c2db5b486688530_1768041031_1356.png	Fig. 1.5 — Engineered microporous surfaces: micro-thick metallic foam, dual-layer microporous structure, and mixed-size sintered copper powder.	658	184	0	2026-06-23 04:30:17.035	2026-06-23 04:30:17.035	f
cmpv1c16a000frnx1h6v7hr02	cmpv1c16a000ernx17lv4c9jt	/legacy/a3245e0ac548072f0c2db5b486688530_1768041215_287.png	Fig. 1.6 — SEM cross-sections of the microporous layers with time-resolved contact-angle (wicking) measurements.	658	225	0	2026-06-23 04:30:17.035	2026-06-23 04:30:17.035	f
cmpv1c16b000hrnx1tjo9h65g	cmpv1c16b000grnx130892mcp	/legacy/a3245e0ac548072f0c2db5b486688530_1768043562_6117.png	Fig. 1.7 — Aluminum–acetone particle-brazed microporous surface: SEM morphology and pool boiling curves benchmarked against prior surface–fluid combinations.	658	474	0	2026-06-23 04:30:17.035	2026-06-23 04:30:17.035	f
cmpv1c1640004rnx153bvvua2	cmpv1c1610002rnx1az890ikf	/legacy/a3245e0ac548072f0c2db5b486688530_1768049701_0019.gif	Fig. 1.1b — High-speed visualization of fully developed nucleate boiling.	300	480	0	2026-06-23 04:30:17.035	2026-06-24 10:51:24.883	f
cmpv1c1640003rnx1kxwgh83b	cmpv1c1610002rnx1az890ikf	/legacy/a3245e0ac548072f0c2db5b486688530_1768049644_0238.gif	Fig. 1.1a — High-speed visualization of pool boiling in the isolated-bubble regime.	300	480	2	2026-06-23 04:30:17.035	2026-06-24 10:54:06.241	f
cmpv1c1640005rnx19xrx2zem	cmpv1c1610002rnx1az890ikf	/legacy/a3245e0ac548072f0c2db5b486688530_1768049993_1921.png	Fig. 1.1c — Characteristic pool boiling curve: heat flux versus wall superheat for a microstructured surface against plain copper, marking the HTC enhancement and CHF.	700	525	1	2026-06-23 04:30:17.035	2026-06-24 10:54:06.244	f
\.


--
-- Data for Name: _MemberToPublication; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."_MemberToPublication" ("A", "B") FROM stdin;
cmpe74j44000hgzx1x9p2qc4q	cmpe74j76003wgzx1znhqien2
cmpe74j390000gzx1cuk8wyur	cmpe74j76003wgzx1znhqien2
cmpe74j390000gzx1cuk8wyur	cmpe74j75003vgzx1tzx6sz58
cmpe74j4b000mgzx1sncuygpb	cmpe74j73003tgzx16tct4w0c
cmpe74j3i0002gzx1baa9dhz1	cmpe74j73003tgzx16tct4w0c
cmpe74j390000gzx1cuk8wyur	cmpe74j73003tgzx16tct4w0c
cmpe74j48000kgzx1w4thy5ji	cmpe74j72003rgzx1slr7vy90
cmpe74j390000gzx1cuk8wyur	cmpe74j72003rgzx1slr7vy90
cmpe74j390000gzx1cuk8wyur	cmpe74j71003qgzx1m3nzwszi
cmpe74j4c000ngzx10b4eyg66	cmpe74j6x003mgzx1a3132xo7
cmpe74j390000gzx1cuk8wyur	cmpe74j6x003mgzx1a3132xo7
cmpe74j43000ggzx1me27g5xa	cmpe74j72003sgzx11204b0ce
cmpe74j42000fgzx19p33f83j	cmpe74j72003sgzx11204b0ce
cmpe74j390000gzx1cuk8wyur	cmpe74j72003sgzx11204b0ce
cmpe74j3o0004gzx1i329kbyo	cmpe74j70003pgzx1rnto563r
cmpe74j3p0005gzx1mb2y8ha5	cmpe74j70003pgzx1rnto563r
cmpe74j390000gzx1cuk8wyur	cmpe74j70003pgzx1rnto563r
cmpe74j47000jgzx1ui30thrq	cmpe74j6z003ogzx1zx8om3po
cmpe74j4b000mgzx1sncuygpb	cmpe74j6z003ogzx1zx8om3po
cmpe74j3i0002gzx1baa9dhz1	cmpe74j6z003ogzx1zx8om3po
cmpe74j390000gzx1cuk8wyur	cmpe74j6z003ogzx1zx8om3po
cmpe74j3l0003gzx1yoev3819	cmpe74j6y003ngzx1yxvhzxrr
cmpe74j3r0006gzx1zx95oohi	cmpe74j6y003ngzx1yxvhzxrr
cmpe74j42000fgzx19p33f83j	cmpe74j6y003ngzx1yxvhzxrr
cmpe74j390000gzx1cuk8wyur	cmpe74j6y003ngzx1yxvhzxrr
cmpe74j4c000ngzx10b4eyg66	cmpe74j6w003lgzx11aqy2z8d
cmpe74j3l0003gzx1yoev3819	cmpe74j6w003lgzx11aqy2z8d
cmpe74j4b000mgzx1sncuygpb	cmpe74j6w003lgzx11aqy2z8d
cmpe74j3i0002gzx1baa9dhz1	cmpe74j6w003lgzx11aqy2z8d
cmpe74j390000gzx1cuk8wyur	cmpe74j6w003lgzx11aqy2z8d
cmpe74j4c000ngzx10b4eyg66	cmpe74j6v003kgzx11fqw2xof
cmpe74j4b000mgzx1sncuygpb	cmpe74j6v003kgzx11fqw2xof
cmpe74j3i0002gzx1baa9dhz1	cmpe74j6v003kgzx11fqw2xof
cmpe74j390000gzx1cuk8wyur	cmpe74j6v003kgzx11fqw2xof
cmpe74j42000fgzx19p33f83j	cmpe74j6u003jgzx19rvj8n28
cmpe74j44000hgzx1x9p2qc4q	cmpe74j6u003jgzx19rvj8n28
cmpe74j390000gzx1cuk8wyur	cmpe74j6u003jgzx19rvj8n28
cmpe74j44000hgzx1x9p2qc4q	cmpe74j6u003igzx1b800q816
cmpe74j390000gzx1cuk8wyur	cmpe74j6u003igzx1b800q816
cmpe74j44000hgzx1x9p2qc4q	cmpe74j6t003hgzx1gdpjy6bx
cmpe74j390000gzx1cuk8wyur	cmpe74j6t003hgzx1gdpjy6bx
cmpe74j48000kgzx1w4thy5ji	cmpe74j6s003ggzx1ht1u1iax
cmpe74j4b000mgzx1sncuygpb	cmpe74j6s003ggzx1ht1u1iax
cmpe74j3i0002gzx1baa9dhz1	cmpe74j6s003ggzx1ht1u1iax
cmpe74j390000gzx1cuk8wyur	cmpe74j6s003ggzx1ht1u1iax
cmpe74j4c000ngzx10b4eyg66	cmpe74j6r003fgzx1dgwu9zze
cmpe74j3o0004gzx1i329kbyo	cmpe74j6r003fgzx1dgwu9zze
cmpe74j4b000mgzx1sncuygpb	cmpe74j6r003fgzx1dgwu9zze
cmpe74j3i0002gzx1baa9dhz1	cmpe74j6r003fgzx1dgwu9zze
cmpe74j390000gzx1cuk8wyur	cmpe74j6r003fgzx1dgwu9zze
cmpe74j44000hgzx1x9p2qc4q	cmpe74j6r003egzx1rvs9926g
cmpe74j390000gzx1cuk8wyur	cmpe74j6r003egzx1rvs9926g
cmpe74j43000ggzx1me27g5xa	cmpe74j6q003dgzx1zseseu1g
cmpe74j42000fgzx19p33f83j	cmpe74j6q003dgzx1zseseu1g
cmpe74j390000gzx1cuk8wyur	cmpe74j6q003dgzx1zseseu1g
cmpe74j42000fgzx19p33f83j	cmpe74j6p003cgzx12ucmg5rl
cmpe74j390000gzx1cuk8wyur	cmpe74j6p003cgzx12ucmg5rl
cmpe74j390000gzx1cuk8wyur	cmpe74j6o003bgzx1zuee8dsp
cmpe74j390000gzx1cuk8wyur	cmpe74j6n003agzx1l8q19pfk
cmpe74j4a000lgzx1dxx3x9c4	cmpe74j6n0039gzx1eob2ng0q
cmpe74j4b000mgzx1sncuygpb	cmpe74j6n0039gzx1eob2ng0q
cmpe74j3i0002gzx1baa9dhz1	cmpe74j6n0039gzx1eob2ng0q
cmpe74j390000gzx1cuk8wyur	cmpe74j6n0039gzx1eob2ng0q
cmpe74j3l0003gzx1yoev3819	cmpe74j6m0038gzx1xwzeirfc
cmpe74j4b000mgzx1sncuygpb	cmpe74j6m0038gzx1xwzeirfc
cmpe74j3i0002gzx1baa9dhz1	cmpe74j6m0038gzx1xwzeirfc
cmpe74j390000gzx1cuk8wyur	cmpe74j6m0038gzx1xwzeirfc
cmpe74j4c000ngzx10b4eyg66	cmpe74j6l0037gzx1w6mhxsds
cmpe74j43000ggzx1me27g5xa	cmpe74j6l0037gzx1w6mhxsds
cmpe74j390000gzx1cuk8wyur	cmpe74j6l0037gzx1w6mhxsds
cmpe74j42000fgzx19p33f83j	cmpe74j6k0036gzx1u13crx65
cmpe74j390000gzx1cuk8wyur	cmpe74j6k0036gzx1u13crx65
cmpe74j390000gzx1cuk8wyur	cmpe74j6j0035gzx1blsqlvj8
cmpe74j48000kgzx1w4thy5ji	cmpe74j8j0065gzx1hvtrr20l
cmpe74j390000gzx1cuk8wyur	cmpe74j8j0065gzx1hvtrr20l
cmpe74j3o0004gzx1i329kbyo	cmpe74j8i0064gzx1ojffpkwk
cmpe74j3p0005gzx1mb2y8ha5	cmpe74j8i0064gzx1ojffpkwk
cmpe74j390000gzx1cuk8wyur	cmpe74j8i0064gzx1ojffpkwk
cmpe74j4b000mgzx1sncuygpb	cmpe74j8i0063gzx1572hltcz
cmpe74j3i0002gzx1baa9dhz1	cmpe74j8i0063gzx1572hltcz
cmpe74j390000gzx1cuk8wyur	cmpe74j8i0063gzx1572hltcz
cmpe74j4b000mgzx1sncuygpb	cmpe74j8h0062gzx1wthyrunk
cmpe74j3i0002gzx1baa9dhz1	cmpe74j8h0062gzx1wthyrunk
cmpe74j390000gzx1cuk8wyur	cmpe74j8h0062gzx1wthyrunk
cmpe74j48000kgzx1w4thy5ji	cmpe74j8h0061gzx158uxtiam
cmpe74j4b000mgzx1sncuygpb	cmpe74j8h0061gzx158uxtiam
cmpe74j3i0002gzx1baa9dhz1	cmpe74j8h0061gzx158uxtiam
cmpe74j390000gzx1cuk8wyur	cmpe74j8h0061gzx158uxtiam
cmpe74j4a000lgzx1dxx3x9c4	cmpe74j8g0060gzx1bu52jgbw
cmpe74j390000gzx1cuk8wyur	cmpe74j8g0060gzx1bu52jgbw
cmpe74j44000hgzx1x9p2qc4q	cmpe74j6i0034gzx10ic7tfbu
cmpe74j390000gzx1cuk8wyur	cmpe74j6i0034gzx10ic7tfbu
cmpe74j42000fgzx19p33f83j	cmpe74j6h0033gzx19sgph9k9
cmpe74j390000gzx1cuk8wyur	cmpe74j6h0033gzx19sgph9k9
cmpe74j43000ggzx1me27g5xa	cmpe74j6g0032gzx1yi9jwkx9
cmpe74j42000fgzx19p33f83j	cmpe74j6g0032gzx1yi9jwkx9
cmpe74j44000hgzx1x9p2qc4q	cmpe74j6g0032gzx1yi9jwkx9
cmpe74j390000gzx1cuk8wyur	cmpe74j6g0032gzx1yi9jwkx9
cmpe74j3o0004gzx1i329kbyo	cmpe74j6g0031gzx14a93ww13
cmpe74j4b000mgzx1sncuygpb	cmpe74j6g0031gzx14a93ww13
cmpe74j3i0002gzx1baa9dhz1	cmpe74j6g0031gzx14a93ww13
cmpe74j390000gzx1cuk8wyur	cmpe74j6g0031gzx14a93ww13
cmpe74j46000igzx1c7gb1jrf	cmpe74j6f0030gzx14yjclrfp
cmpe74j42000fgzx19p33f83j	cmpe74j6f0030gzx14yjclrfp
cmpe74j44000hgzx1x9p2qc4q	cmpe74j6f0030gzx14yjclrfp
cmpe74j390000gzx1cuk8wyur	cmpe74j6f0030gzx14yjclrfp
cmpe74j43000ggzx1me27g5xa	cmpe74j6e002zgzx19eoa2cj4
cmpe74j42000fgzx19p33f83j	cmpe74j6e002zgzx19eoa2cj4
cmpe74j390000gzx1cuk8wyur	cmpe74j6e002zgzx19eoa2cj4
cmpe74j390000gzx1cuk8wyur	cmpe74j6d002ygzx14pnqa9ut
cmpe74j46000igzx1c7gb1jrf	cmpe74j6c002xgzx1cn3ojp82
cmpe74j42000fgzx19p33f83j	cmpe74j6c002xgzx1cn3ojp82
cmpe74j44000hgzx1x9p2qc4q	cmpe74j6c002xgzx1cn3ojp82
cmpe74j390000gzx1cuk8wyur	cmpe74j6c002xgzx1cn3ojp82
cmpe74j46000igzx1c7gb1jrf	cmpe74j6b002wgzx1il15tg1l
cmpe74j42000fgzx19p33f83j	cmpe74j6b002wgzx1il15tg1l
cmpe74j44000hgzx1x9p2qc4q	cmpe74j6b002wgzx1il15tg1l
cmpe74j390000gzx1cuk8wyur	cmpe74j6b002wgzx1il15tg1l
cmpe74j4c000ngzx10b4eyg66	cmpe74j6a002vgzx1jl6f7sp1
cmpe74j3l0003gzx1yoev3819	cmpe74j6a002vgzx1jl6f7sp1
cmpe74j3o0004gzx1i329kbyo	cmpe74j6a002vgzx1jl6f7sp1
cmpe74j4b000mgzx1sncuygpb	cmpe74j6a002vgzx1jl6f7sp1
cmpe74j3i0002gzx1baa9dhz1	cmpe74j6a002vgzx1jl6f7sp1
cmpe74j390000gzx1cuk8wyur	cmpe74j6a002vgzx1jl6f7sp1
cmpe74j390000gzx1cuk8wyur	cmpe74j69002ugzx113koaocm
cmpe74j42000fgzx19p33f83j	cmpe74j68002tgzx1txblngj2
cmpe74j44000hgzx1x9p2qc4q	cmpe74j68002tgzx1txblngj2
cmpe74j390000gzx1cuk8wyur	cmpe74j68002tgzx1txblngj2
cmpe74j3l0003gzx1yoev3819	cmpe74j8g005zgzx1y3h01jck
cmpe74j4b000mgzx1sncuygpb	cmpe74j8g005zgzx1y3h01jck
cmpe74j3i0002gzx1baa9dhz1	cmpe74j8g005zgzx1y3h01jck
cmpe74j390000gzx1cuk8wyur	cmpe74j8g005zgzx1y3h01jck
cmpe74j4c000ngzx10b4eyg66	cmpe74j8f005ygzx1qzwxurxs
cmpe74j3o0004gzx1i329kbyo	cmpe74j8f005ygzx1qzwxurxs
cmpe74j4b000mgzx1sncuygpb	cmpe74j8f005ygzx1qzwxurxs
cmpe74j3i0002gzx1baa9dhz1	cmpe74j8f005ygzx1qzwxurxs
cmpe74j390000gzx1cuk8wyur	cmpe74j8f005ygzx1qzwxurxs
cmpe74j3o0004gzx1i329kbyo	cmpe74j8e005xgzx1zv9mol21
cmpe74j4b000mgzx1sncuygpb	cmpe74j8e005xgzx1zv9mol21
cmpe74j3i0002gzx1baa9dhz1	cmpe74j8e005xgzx1zv9mol21
cmpe74j390000gzx1cuk8wyur	cmpe74j8e005xgzx1zv9mol21
cmpe74j48000kgzx1w4thy5ji	cmpe74j8d005wgzx15swhi0an
cmpe74j4b000mgzx1sncuygpb	cmpe74j8d005wgzx15swhi0an
cmpe74j3i0002gzx1baa9dhz1	cmpe74j8d005wgzx15swhi0an
cmpe74j390000gzx1cuk8wyur	cmpe74j8d005wgzx15swhi0an
cmpe74j43000ggzx1me27g5xa	cmpe74j8c005vgzx13hi7vinu
cmpe74j42000fgzx19p33f83j	cmpe74j8c005vgzx13hi7vinu
cmpe74j390000gzx1cuk8wyur	cmpe74j8c005vgzx13hi7vinu
cmpe74j44000hgzx1x9p2qc4q	cmpe74j8c005ugzx1lctxmawb
cmpe74j390000gzx1cuk8wyur	cmpe74j8c005ugzx1lctxmawb
cmpe74j44000hgzx1x9p2qc4q	cmpe74j8b005tgzx1azng99kd
cmpe74j390000gzx1cuk8wyur	cmpe74j8b005tgzx1azng99kd
cmpe74j3o0004gzx1i329kbyo	cmpe74j8b005sgzx1cvfzs2wm
cmpe74j4b000mgzx1sncuygpb	cmpe74j8b005sgzx1cvfzs2wm
cmpe74j3i0002gzx1baa9dhz1	cmpe74j8b005sgzx1cvfzs2wm
cmpe74j390000gzx1cuk8wyur	cmpe74j8b005sgzx1cvfzs2wm
cmpe74j4c000ngzx10b4eyg66	cmpe74j8b005rgzx1l9brqp3e
cmpe74j43000ggzx1me27g5xa	cmpe74j8b005rgzx1l9brqp3e
cmpe74j42000fgzx19p33f83j	cmpe74j8b005rgzx1l9brqp3e
cmpe74j390000gzx1cuk8wyur	cmpe74j8b005rgzx1l9brqp3e
cmpe74j43000ggzx1me27g5xa	cmpe74j8a005qgzx1hdnb65cz
cmpe74j42000fgzx19p33f83j	cmpe74j8a005qgzx1hdnb65cz
cmpe74j390000gzx1cuk8wyur	cmpe74j8a005qgzx1hdnb65cz
cmpe74j47000jgzx1ui30thrq	cmpe74j8a005pgzx1lafsn4cd
cmpe74j390000gzx1cuk8wyur	cmpe74j8a005pgzx1lafsn4cd
cmpe74j3l0003gzx1yoev3819	cmpe74j89005ogzx1vxzt9jql
cmpe74j4b000mgzx1sncuygpb	cmpe74j89005ogzx1vxzt9jql
cmpe74j3i0002gzx1baa9dhz1	cmpe74j89005ogzx1vxzt9jql
cmpe74j390000gzx1cuk8wyur	cmpe74j89005ogzx1vxzt9jql
cmpe74j4b000mgzx1sncuygpb	cmpe74j89005ngzx1a7cihblz
cmpe74j3i0002gzx1baa9dhz1	cmpe74j89005ngzx1a7cihblz
cmpe74j390000gzx1cuk8wyur	cmpe74j89005ngzx1a7cihblz
cmpe74j4a000lgzx1dxx3x9c4	cmpe74j88005mgzx1xjog7dua
cmpe74j4b000mgzx1sncuygpb	cmpe74j88005mgzx1xjog7dua
cmpe74j3i0002gzx1baa9dhz1	cmpe74j88005mgzx1xjog7dua
cmpe74j390000gzx1cuk8wyur	cmpe74j88005mgzx1xjog7dua
cmpe74j44000hgzx1x9p2qc4q	cmpe74j88005lgzx18ntvhmpm
cmpe74j390000gzx1cuk8wyur	cmpe74j88005lgzx18ntvhmpm
cmpe74j42000fgzx19p33f83j	cmpe74j87005kgzx1eltms6gu
cmpe74j390000gzx1cuk8wyur	cmpe74j87005kgzx1eltms6gu
cmpe74j47000jgzx1ui30thrq	cmpe74j87005jgzx1lbumspp4
cmpe74j4b000mgzx1sncuygpb	cmpe74j87005jgzx1lbumspp4
cmpe74j3i0002gzx1baa9dhz1	cmpe74j87005jgzx1lbumspp4
cmpe74j390000gzx1cuk8wyur	cmpe74j87005jgzx1lbumspp4
cmpe74j43000ggzx1me27g5xa	cmpe74j86005igzx16wwrjhuh
cmpe74j42000fgzx19p33f83j	cmpe74j86005igzx16wwrjhuh
cmpe74j390000gzx1cuk8wyur	cmpe74j86005igzx16wwrjhuh
cmpe74j44000hgzx1x9p2qc4q	cmpe74j85005hgzx1rskn29na
cmpe74j390000gzx1cuk8wyur	cmpe74j85005hgzx1rskn29na
cmpe74j48000kgzx1w4thy5ji	cmpe74j85005ggzx1f3s47kfs
cmpe74j4b000mgzx1sncuygpb	cmpe74j85005ggzx1f3s47kfs
cmpe74j3i0002gzx1baa9dhz1	cmpe74j85005ggzx1f3s47kfs
cmpe74j390000gzx1cuk8wyur	cmpe74j85005ggzx1f3s47kfs
cmpe74j43000ggzx1me27g5xa	cmpe74j84005fgzx1ogqozcky
cmpe74j42000fgzx19p33f83j	cmpe74j84005fgzx1ogqozcky
cmpe74j44000hgzx1x9p2qc4q	cmpe74j84005fgzx1ogqozcky
cmpe74j390000gzx1cuk8wyur	cmpe74j84005fgzx1ogqozcky
cmpe74j43000ggzx1me27g5xa	cmpe74j84005egzx1jv9r8mx5
cmpe74j42000fgzx19p33f83j	cmpe74j84005egzx1jv9r8mx5
cmpe74j44000hgzx1x9p2qc4q	cmpe74j84005egzx1jv9r8mx5
cmpe74j390000gzx1cuk8wyur	cmpe74j84005egzx1jv9r8mx5
cmpe74j47000jgzx1ui30thrq	cmpe74j84005dgzx1cqgrmmf8
cmpe74j48000kgzx1w4thy5ji	cmpe74j84005dgzx1cqgrmmf8
cmpe74j390000gzx1cuk8wyur	cmpe74j84005dgzx1cqgrmmf8
cmpe74j4a000lgzx1dxx3x9c4	cmpe74j83005cgzx1cv7ffstz
cmpe74j4b000mgzx1sncuygpb	cmpe74j83005cgzx1cv7ffstz
cmpe74j3i0002gzx1baa9dhz1	cmpe74j83005cgzx1cv7ffstz
cmpe74j390000gzx1cuk8wyur	cmpe74j83005cgzx1cv7ffstz
cmpe74j3o0004gzx1i329kbyo	cmpe74j83005bgzx194pzuz7a
cmpe74j4b000mgzx1sncuygpb	cmpe74j83005bgzx194pzuz7a
cmpe74j3i0002gzx1baa9dhz1	cmpe74j83005bgzx194pzuz7a
cmpe74j390000gzx1cuk8wyur	cmpe74j83005bgzx194pzuz7a
cmpe74j3l0003gzx1yoev3819	cmpe74j82005agzx1xltyir6k
cmpe74j4b000mgzx1sncuygpb	cmpe74j82005agzx1xltyir6k
cmpe74j3i0002gzx1baa9dhz1	cmpe74j82005agzx1xltyir6k
cmpe74j390000gzx1cuk8wyur	cmpe74j82005agzx1xltyir6k
cmpe74j47000jgzx1ui30thrq	cmpe74j820059gzx1a456le3r
cmpe74j4b000mgzx1sncuygpb	cmpe74j820059gzx1a456le3r
cmpe74j3i0002gzx1baa9dhz1	cmpe74j820059gzx1a456le3r
cmpe74j390000gzx1cuk8wyur	cmpe74j820059gzx1a456le3r
cmpe74j3o0004gzx1i329kbyo	cmpe74j810058gzx1ivjdbb3p
cmpe74j4b000mgzx1sncuygpb	cmpe74j810058gzx1ivjdbb3p
cmpe74j3i0002gzx1baa9dhz1	cmpe74j810058gzx1ivjdbb3p
cmpe74j390000gzx1cuk8wyur	cmpe74j810058gzx1ivjdbb3p
cmpe74j390000gzx1cuk8wyur	cmpe74j8r006ggzx13hxgbw3l
cmpe74j390000gzx1cuk8wyur	cmpe74j8r006fgzx1hnfmxl30
cmpe74j42000fgzx19p33f83j	cmpe74j68002sgzx16cswcn2t
cmpe74j44000hgzx1x9p2qc4q	cmpe74j68002sgzx16cswcn2t
cmpe74j390000gzx1cuk8wyur	cmpe74j68002sgzx16cswcn2t
cmpe74j42000fgzx19p33f83j	cmpe74j67002rgzx1oit0v06n
cmpe74j44000hgzx1x9p2qc4q	cmpe74j67002rgzx1oit0v06n
cmpe74j390000gzx1cuk8wyur	cmpe74j67002rgzx1oit0v06n
cmpe74j44000hgzx1x9p2qc4q	cmpe74j66002qgzx1bfx7enn8
cmpe74j390000gzx1cuk8wyur	cmpe74j66002qgzx1bfx7enn8
cmpe74j4c000ngzx10b4eyg66	cmpe74j65002pgzx1103j2zod
cmpe74j390000gzx1cuk8wyur	cmpe74j65002pgzx1103j2zod
cmpe74j4c000ngzx10b4eyg66	cmpe74j64002ogzx1853ic01b
cmpe74j390000gzx1cuk8wyur	cmpe74j64002ogzx1853ic01b
cmpe74j4c000ngzx10b4eyg66	cmpe74j810057gzx1tuc68o57
cmpe74j4b000mgzx1sncuygpb	cmpe74j810057gzx1tuc68o57
cmpe74j3i0002gzx1baa9dhz1	cmpe74j810057gzx1tuc68o57
cmpe74j390000gzx1cuk8wyur	cmpe74j810057gzx1tuc68o57
cmpe74j4c000ngzx10b4eyg66	cmpe74j800056gzx1telgyu6o
cmpe74j3o0004gzx1i329kbyo	cmpe74j800056gzx1telgyu6o
cmpe74j4b000mgzx1sncuygpb	cmpe74j800056gzx1telgyu6o
cmpe74j3i0002gzx1baa9dhz1	cmpe74j800056gzx1telgyu6o
cmpe74j390000gzx1cuk8wyur	cmpe74j800056gzx1telgyu6o
cmpe74j43000ggzx1me27g5xa	cmpe74j7z0055gzx1ql27689q
cmpe74j42000fgzx19p33f83j	cmpe74j7z0055gzx1ql27689q
cmpe74j390000gzx1cuk8wyur	cmpe74j7z0055gzx1ql27689q
cmpe74j390000gzx1cuk8wyur	cmpe74j7z0054gzx1ja9x6gnq
cmpe74j42000fgzx19p33f83j	cmpe74j7y0053gzx1jyr7czzy
cmpe74j390000gzx1cuk8wyur	cmpe74j7y0053gzx1jyr7czzy
cmpe74j43000ggzx1me27g5xa	cmpe74j7y0052gzx1gu0696om
cmpe74j42000fgzx19p33f83j	cmpe74j7y0052gzx1gu0696om
cmpe74j44000hgzx1x9p2qc4q	cmpe74j7y0052gzx1gu0696om
cmpe74j390000gzx1cuk8wyur	cmpe74j7y0052gzx1gu0696om
cmpe74j42000fgzx19p33f83j	cmpe74j7x0051gzx1d86e66kn
cmpe74j44000hgzx1x9p2qc4q	cmpe74j7x0051gzx1d86e66kn
cmpe74j390000gzx1cuk8wyur	cmpe74j7x0051gzx1d86e66kn
cmpe74j390000gzx1cuk8wyur	cmpe74j7x0050gzx1rnlgb3r2
cmpe74j390000gzx1cuk8wyur	cmpe74j7w004zgzx1fns80n0s
cmpe74j390000gzx1cuk8wyur	cmpe74j7w004ygzx1fkmwg9v0
cmpe74j4c000ngzx10b4eyg66	cmpe74j7w004xgzx1h2cdz0fm
cmpe74j4b000mgzx1sncuygpb	cmpe74j7w004xgzx1h2cdz0fm
cmpe74j3i0002gzx1baa9dhz1	cmpe74j7w004xgzx1h2cdz0fm
cmpe74j390000gzx1cuk8wyur	cmpe74j7w004xgzx1h2cdz0fm
cmpe74j42000fgzx19p33f83j	cmpe74j7v004wgzx165u1aq7j
cmpe74j44000hgzx1x9p2qc4q	cmpe74j7v004wgzx165u1aq7j
cmpe74j390000gzx1cuk8wyur	cmpe74j7v004wgzx165u1aq7j
cmpe74j42000fgzx19p33f83j	cmpe74j7v004vgzx1tjo5ikq7
cmpe74j44000hgzx1x9p2qc4q	cmpe74j7v004vgzx1tjo5ikq7
cmpe74j390000gzx1cuk8wyur	cmpe74j7v004vgzx1tjo5ikq7
cmpe74j46000igzx1c7gb1jrf	cmpe74j7u004ugzx1h5bg89er
cmpe74j42000fgzx19p33f83j	cmpe74j7u004ugzx1h5bg89er
cmpe74j44000hgzx1x9p2qc4q	cmpe74j7u004ugzx1h5bg89er
cmpe74j390000gzx1cuk8wyur	cmpe74j7u004ugzx1h5bg89er
cmpe74j43000ggzx1me27g5xa	cmpe74j7t004tgzx1lj86vt0z
cmpe74j42000fgzx19p33f83j	cmpe74j7t004tgzx1lj86vt0z
cmpe74j390000gzx1cuk8wyur	cmpe74j7t004tgzx1lj86vt0z
cmpe74j46000igzx1c7gb1jrf	cmpe74j7s004sgzx1kqkk6ueq
cmpe74j42000fgzx19p33f83j	cmpe74j7s004sgzx1kqkk6ueq
cmpe74j44000hgzx1x9p2qc4q	cmpe74j7s004sgzx1kqkk6ueq
cmpe74j390000gzx1cuk8wyur	cmpe74j7s004sgzx1kqkk6ueq
cmpe74j4c000ngzx10b4eyg66	cmpe74j7r004rgzx11g8gftda
cmpe74j4b000mgzx1sncuygpb	cmpe74j7r004rgzx11g8gftda
cmpe74j3i0002gzx1baa9dhz1	cmpe74j7r004rgzx11g8gftda
cmpe74j390000gzx1cuk8wyur	cmpe74j7r004rgzx11g8gftda
cmpe74j4c000ngzx10b4eyg66	cmpe74j7r004qgzx19wt42i5o
cmpe74j4b000mgzx1sncuygpb	cmpe74j7r004qgzx19wt42i5o
cmpe74j3i0002gzx1baa9dhz1	cmpe74j7r004qgzx19wt42i5o
cmpe74j390000gzx1cuk8wyur	cmpe74j7r004qgzx19wt42i5o
cmpe74j4c000ngzx10b4eyg66	cmpe74j7q004pgzx14dstwkuk
cmpe74j4b000mgzx1sncuygpb	cmpe74j7q004pgzx14dstwkuk
cmpe74j3i0002gzx1baa9dhz1	cmpe74j7q004pgzx14dstwkuk
cmpe74j390000gzx1cuk8wyur	cmpe74j7q004pgzx14dstwkuk
cmpe74j4c000ngzx10b4eyg66	cmpe74j7p004ngzx1vack97j9
cmpe74j4b000mgzx1sncuygpb	cmpe74j7p004ngzx1vack97j9
cmpe74j3i0002gzx1baa9dhz1	cmpe74j7p004ngzx1vack97j9
cmpe74j390000gzx1cuk8wyur	cmpe74j7p004ngzx1vack97j9
cmpe74j4c000ngzx10b4eyg66	cmpe74j7p004lgzx1jinhkfj5
cmpe74j4b000mgzx1sncuygpb	cmpe74j7p004lgzx1jinhkfj5
cmpe74j3i0002gzx1baa9dhz1	cmpe74j7p004lgzx1jinhkfj5
cmpe74j390000gzx1cuk8wyur	cmpe74j7p004lgzx1jinhkfj5
cmpe74j42000fgzx19p33f83j	cmpe74j7o004kgzx1b8bmavy4
cmpe74j44000hgzx1x9p2qc4q	cmpe74j7o004kgzx1b8bmavy4
cmpe74j390000gzx1cuk8wyur	cmpe74j7o004kgzx1b8bmavy4
cmpe74j42000fgzx19p33f83j	cmpe74j7o004jgzx17jdt8li5
cmpe74j390000gzx1cuk8wyur	cmpe74j7o004jgzx17jdt8li5
cmpe74j42000fgzx19p33f83j	cmpe74j7n004igzx1edwogbgx
cmpe74j44000hgzx1x9p2qc4q	cmpe74j7n004igzx1edwogbgx
cmpe74j390000gzx1cuk8wyur	cmpe74j7n004igzx1edwogbgx
cmpe74j42000fgzx19p33f83j	cmpe74j8q006egzx1m6oat2da
cmpe74j4b000mgzx1sncuygpb	cmpe74j8q006egzx1m6oat2da
cmpe74j3i0002gzx1baa9dhz1	cmpe74j8q006egzx1m6oat2da
cmpe74j390000gzx1cuk8wyur	cmpe74j8q006egzx1m6oat2da
cmpe74j390000gzx1cuk8wyur	cmpe74j63002ngzx1vza849o5
cmpe74j390000gzx1cuk8wyur	cmpe74j63002mgzx1c0jmcavb
cmpe74j390000gzx1cuk8wyur	cmpe74j62002lgzx1n77bsw5f
cmpe74j43000ggzx1me27g5xa	cmpe74j61002kgzx18ql8m3c0
cmpe74j390000gzx1cuk8wyur	cmpe74j61002kgzx18ql8m3c0
cmpe74j390000gzx1cuk8wyur	cmpe74j60002jgzx1bpn23oqm
cmpe74j390000gzx1cuk8wyur	cmpe74j5z002igzx1s9y390xz
cmpe74j390000gzx1cuk8wyur	cmpe74j5y002hgzx1x69sjzsh
cmpe74j4c000ngzx10b4eyg66	cmpe74j7q004ogzx19ugbc7sa
cmpe74j4b000mgzx1sncuygpb	cmpe74j7q004ogzx19ugbc7sa
cmpe74j3i0002gzx1baa9dhz1	cmpe74j7q004ogzx19ugbc7sa
cmpe74j390000gzx1cuk8wyur	cmpe74j7q004ogzx19ugbc7sa
cmpe74j4c000ngzx10b4eyg66	cmpe74j7p004mgzx1vmofbhf6
cmpe74j4b000mgzx1sncuygpb	cmpe74j7p004mgzx1vmofbhf6
cmpe74j3i0002gzx1baa9dhz1	cmpe74j7p004mgzx1vmofbhf6
cmpe74j390000gzx1cuk8wyur	cmpe74j7p004mgzx1vmofbhf6
cmpe74j4c000ngzx10b4eyg66	cmpe74j7n004hgzx11kwnqyfy
cmpe74j390000gzx1cuk8wyur	cmpe74j7n004hgzx11kwnqyfy
cmpe74j4c000ngzx10b4eyg66	cmpe74j7m004ggzx13j7g6gdh
cmpe74j4b000mgzx1sncuygpb	cmpe74j7m004ggzx13j7g6gdh
cmpe74j3i0002gzx1baa9dhz1	cmpe74j7m004ggzx13j7g6gdh
cmpe74j390000gzx1cuk8wyur	cmpe74j7m004ggzx13j7g6gdh
cmpe74j4c000ngzx10b4eyg66	cmpe74j7m004fgzx1cqrvug9c
cmpe74j390000gzx1cuk8wyur	cmpe74j7m004fgzx1cqrvug9c
cmpe74j390000gzx1cuk8wyur	cmpe74j7l004egzx1apyhhwn6
cmpe74j390000gzx1cuk8wyur	cmpe74j7k004dgzx1et098i56
cmpe74j44000hgzx1x9p2qc4q	cmpe74j7k004cgzx1kmc20sfv
cmpe74j390000gzx1cuk8wyur	cmpe74j7k004cgzx1kmc20sfv
cmpe74j46000igzx1c7gb1jrf	cmpe74j7j004bgzx14fmpjhem
cmpe74j42000fgzx19p33f83j	cmpe74j7j004bgzx14fmpjhem
cmpe74j44000hgzx1x9p2qc4q	cmpe74j7j004bgzx14fmpjhem
cmpe74j390000gzx1cuk8wyur	cmpe74j7j004bgzx14fmpjhem
cmpe74j390000gzx1cuk8wyur	cmpe74j7i004agzx1exdy9ddw
cmpe74j42000fgzx19p33f83j	cmpe74j7i0049gzx1lw6c8b7b
cmpe74j44000hgzx1x9p2qc4q	cmpe74j7i0049gzx1lw6c8b7b
cmpe74j390000gzx1cuk8wyur	cmpe74j7i0049gzx1lw6c8b7b
cmpe74j43000ggzx1me27g5xa	cmpe74j7h0048gzx1mun1cbe8
cmpe74j4b000mgzx1sncuygpb	cmpe74j7h0048gzx1mun1cbe8
cmpe74j3i0002gzx1baa9dhz1	cmpe74j7h0048gzx1mun1cbe8
cmpe74j390000gzx1cuk8wyur	cmpe74j7h0048gzx1mun1cbe8
cmpe74j44000hgzx1x9p2qc4q	cmpe74j7h0047gzx1l3iijhpm
cmpe74j390000gzx1cuk8wyur	cmpe74j7h0047gzx1l3iijhpm
cmpe74j4c000ngzx10b4eyg66	cmpe74j7g0046gzx15gkxkfio
cmpe74j390000gzx1cuk8wyur	cmpe74j7g0046gzx15gkxkfio
cmpe74j390000gzx1cuk8wyur	cmpe74j7f0045gzx1gwp2n66n
cmpe74j42000fgzx19p33f83j	cmpe74j7e0044gzx1e8okuicg
cmpe74j44000hgzx1x9p2qc4q	cmpe74j7e0044gzx1e8okuicg
cmpe74j390000gzx1cuk8wyur	cmpe74j7e0044gzx1e8okuicg
cmpe74j390000gzx1cuk8wyur	cmpe74j8p006dgzx16vcl4hfr
cmpe74j46000igzx1c7gb1jrf	cmpe74j8p006cgzx1orclbu6a
cmpe74j42000fgzx19p33f83j	cmpe74j8p006cgzx1orclbu6a
cmpe74j390000gzx1cuk8wyur	cmpe74j8p006cgzx1orclbu6a
cmpe74j390000gzx1cuk8wyur	cmpe74j7e0043gzx16iav8gcm
cmpe74j390000gzx1cuk8wyur	cmpe74j7d0042gzx1vbi8e3tj
cmpe74j42000fgzx19p33f83j	cmpe74j8o006bgzx13oxutue3
cmpe74j390000gzx1cuk8wyur	cmpe74j8o006bgzx13oxutue3
cmpe74j4c000ngzx10b4eyg66	cmpe74j7c0041gzx1t2yoc8jp
cmpe74j4b000mgzx1sncuygpb	cmpe74j7c0041gzx1t2yoc8jp
cmpe74j3i0002gzx1baa9dhz1	cmpe74j7c0041gzx1t2yoc8jp
cmpe74j390000gzx1cuk8wyur	cmpe74j7c0041gzx1t2yoc8jp
cmpe74j42000fgzx19p33f83j	cmpe74j8n006agzx1y9lm7a1y
cmpe74j44000hgzx1x9p2qc4q	cmpe74j8n006agzx1y9lm7a1y
cmpe74j390000gzx1cuk8wyur	cmpe74j8n006agzx1y9lm7a1y
cmpe74j42000fgzx19p33f83j	cmpe74j8m0069gzx1xbctt7st
cmpe74j4b000mgzx1sncuygpb	cmpe74j8m0069gzx1xbctt7st
cmpe74j3i0002gzx1baa9dhz1	cmpe74j8m0069gzx1xbctt7st
cmpe74j390000gzx1cuk8wyur	cmpe74j8m0069gzx1xbctt7st
cmpe74j42000fgzx19p33f83j	cmpe74j7b0040gzx1osoqivhu
cmpe74j390000gzx1cuk8wyur	cmpe74j7b0040gzx1osoqivhu
cmpe74j42000fgzx19p33f83j	cmpe74j8m0068gzx1ho442m59
cmpe74j4b000mgzx1sncuygpb	cmpe74j8m0068gzx1ho442m59
cmpe74j3i0002gzx1baa9dhz1	cmpe74j8m0068gzx1ho442m59
cmpe74j390000gzx1cuk8wyur	cmpe74j8m0068gzx1ho442m59
cmpe74j4c000ngzx10b4eyg66	cmpe74j7a003zgzx14da0c8ni
cmpe74j390000gzx1cuk8wyur	cmpe74j7a003zgzx14da0c8ni
cmpe74j390000gzx1cuk8wyur	cmpe74j4y0017gzx1xhz8j37c
cmpe74j390000gzx1cuk8wyur	cmpe74j4x0016gzx18y1hh2xi
cmpe74j4c000ngzx10b4eyg66	cmpe74j4w0015gzx17t6c7zrj
cmpe74j390000gzx1cuk8wyur	cmpe74j4w0015gzx17t6c7zrj
cmpe74j40000egzx1gld9gknp	cmpe74j4w0014gzx1r2tqc167
cmpe74j390000gzx1cuk8wyur	cmpe74j4w0014gzx1r2tqc167
cmpe74j40000egzx1gld9gknp	cmpe74j4v0013gzx149q5pynt
cmpe74j390000gzx1cuk8wyur	cmpe74j4v0013gzx149q5pynt
cmpe74j390000gzx1cuk8wyur	cmpe74j4u0012gzx1ls5fxmel
cmpe74j390000gzx1cuk8wyur	cmpe74j4t0011gzx1ubp1ng1f
cmpe74j390000gzx1cuk8wyur	cmpe74j4s0010gzx1ndrlhpif
cmpe74j390000gzx1cuk8wyur	cmpe74j4r000zgzx19nrzjfia
cmpe74j44000hgzx1x9p2qc4q	cmpe74j4q000ygzx1x6a4qnzc
cmpe74j390000gzx1cuk8wyur	cmpe74j4q000ygzx1x6a4qnzc
cmpe74j390000gzx1cuk8wyur	cmpe74j4o000xgzx1vn8ka73z
cmpe74j42000fgzx19p33f83j	cmpe74j8l0067gzx1uwe5ozu2
cmpe74j4b000mgzx1sncuygpb	cmpe74j8l0067gzx1uwe5ozu2
cmpe74j3i0002gzx1baa9dhz1	cmpe74j8l0067gzx1uwe5ozu2
cmpe74j390000gzx1cuk8wyur	cmpe74j8l0067gzx1uwe5ozu2
cmpe74j44000hgzx1x9p2qc4q	cmpe74j7a003ygzx1rjsfjgpx
cmpe74j390000gzx1cuk8wyur	cmpe74j7a003ygzx1rjsfjgpx
cmpe74j42000fgzx19p33f83j	cmpe74j8k0066gzx1uzcij2e3
cmpe74j4b000mgzx1sncuygpb	cmpe74j8k0066gzx1uzcij2e3
cmpe74j3i0002gzx1baa9dhz1	cmpe74j8k0066gzx1uzcij2e3
cmpe74j390000gzx1cuk8wyur	cmpe74j8k0066gzx1uzcij2e3
cmpe74j4c000ngzx10b4eyg66	cmpe74j79003xgzx1veidk6yu
cmpe74j390000gzx1cuk8wyur	cmpe74j79003xgzx1veidk6yu
cmpe74j390000gzx1cuk8wyur	cmpe74j53001dgzx1wcu11ofe
cmpe74j390000gzx1cuk8wyur	cmpe74j53001cgzx1244c3per
cmpe74j390000gzx1cuk8wyur	cmpe74j52001bgzx13jmw69k5
cmpe74j390000gzx1cuk8wyur	cmpe74j51001agzx1oxrufmig
cmpe74j390000gzx1cuk8wyur	cmpe74j500019gzx18fma11ld
cmpe74j390000gzx1cuk8wyur	cmpe74j4z0018gzx17gp0rhp7
cmpe74j44000hgzx1x9p2qc4q	cmpe74j5b001mgzx1fr75aqx9
cmpe74j390000gzx1cuk8wyur	cmpe74j5b001mgzx1fr75aqx9
cmpe74j390000gzx1cuk8wyur	cmpe74j5a001lgzx1bzvw23jc
cmpe74j390000gzx1cuk8wyur	cmpe74j59001kgzx13y4kksou
cmpe74j390000gzx1cuk8wyur	cmpe74j59001jgzx1glidx5rt
cmpe74j390000gzx1cuk8wyur	cmpe74j58001igzx1vt9rdht1
cmpe74j390000gzx1cuk8wyur	cmpe74j57001hgzx1y82yw979
cmpe74j390000gzx1cuk8wyur	cmpe74j56001ggzx1z437ya0m
cmpe74j390000gzx1cuk8wyur	cmpe74j55001fgzx1upi4i5iz
cmpe74j390000gzx1cuk8wyur	cmpe74j54001egzx1s6moeq7h
cmpe74j390000gzx1cuk8wyur	cmpe74j5i001vgzx1d1lcizju
cmpe74j43000ggzx1me27g5xa	cmpe74j5h001ugzx1caj9lst0
cmpe74j3z000dgzx1ycvtxtez	cmpe74j5h001ugzx1caj9lst0
cmpe74j390000gzx1cuk8wyur	cmpe74j5h001ugzx1caj9lst0
cmpe74j390000gzx1cuk8wyur	cmpe74j5h001tgzx1ahc78enz
cmpe74j390000gzx1cuk8wyur	cmpe74j5g001sgzx1djvj42rd
cmpe74j390000gzx1cuk8wyur	cmpe74j5f001rgzx1mrt76bc6
cmpe74j390000gzx1cuk8wyur	cmpe74j5e001qgzx10psm00e4
cmpe74j390000gzx1cuk8wyur	cmpe74j5d001pgzx1has0l74b
cmpe74j390000gzx1cuk8wyur	cmpe74j5d001ogzx11gh0ngp9
cmpe74j390000gzx1cuk8wyur	cmpe74j5c001ngzx12a8za4pb
cmpe74j4c000ngzx10b4eyg66	cmpe74j5o0022gzx14dyvogk4
cmpe74j390000gzx1cuk8wyur	cmpe74j5o0022gzx14dyvogk4
cmpe74j390000gzx1cuk8wyur	cmpe74j5n0021gzx1bf3pmcrq
cmpe74j4c000ngzx10b4eyg66	cmpe74j5m0020gzx1tu7ux2e0
cmpe74j390000gzx1cuk8wyur	cmpe74j5m0020gzx1tu7ux2e0
cmpe74j390000gzx1cuk8wyur	cmpe74j5l001zgzx187vffr15
cmpe74j390000gzx1cuk8wyur	cmpe74j5k001ygzx1h3ebgap3
cmpe74j40000egzx1gld9gknp	cmpe74j5k001xgzx1pwypxdvl
cmpe74j390000gzx1cuk8wyur	cmpe74j5k001xgzx1pwypxdvl
cmpe74j390000gzx1cuk8wyur	cmpe74j5j001wgzx1su56misc
cmpe74j390000gzx1cuk8wyur	cmpe74j5s0027gzx1bwn9g06v
cmpe74j390000gzx1cuk8wyur	cmpe74j5r0026gzx13zjzcfad
cmpe74j390000gzx1cuk8wyur	cmpe74j5q0025gzx10erttx43
cmpe74j40000egzx1gld9gknp	cmpe74j5p0024gzx176mclmta
cmpe74j390000gzx1cuk8wyur	cmpe74j5p0024gzx176mclmta
cmpe74j390000gzx1cuk8wyur	cmpe74j5o0023gzx1n2fhp9iy
cmpe74j40000egzx1gld9gknp	cmpe74j5t002agzx1grn22tqb
cmpe74j390000gzx1cuk8wyur	cmpe74j5t002agzx1grn22tqb
cmpe74j40000egzx1gld9gknp	cmpe74j5t0029gzx1uuqgzo4v
cmpe74j390000gzx1cuk8wyur	cmpe74j5t0029gzx1uuqgzo4v
cmpe74j390000gzx1cuk8wyur	cmpe74j5s0028gzx1ckkptale
cmpe74j390000gzx1cuk8wyur	cmpe74j5y002ggzx1aegi89ov
cmpe74j390000gzx1cuk8wyur	cmpe74j5x002fgzx1rkwqtqmd
cmpe74j390000gzx1cuk8wyur	cmpe74j5w002egzx1vvzcghe0
cmpe74j390000gzx1cuk8wyur	cmpe74j5v002dgzx1rwsngndr
cmpe74j390000gzx1cuk8wyur	cmpe74j5v002cgzx13ifmrkxb
\.


--
-- Data for Name: BoardPageMeta; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."BoardPageMeta" (id, "heroHeadline", "heroParagraph", "createdAt", "updatedAt") FROM stdin;
cmqt1tsdn0000ykx14wpgwhj5	News & moments\r\nfrom the lab.	Press coverage, awards, and grant announcements alongside photos from conferences, kickoff meetings, and lab events. Korean titles are preserved verbatim from the legacy site.	2026-06-25 05:15:39.371	2026-06-25 05:20:59.943
\.


--
-- Data for Name: GalleryItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."GalleryItem" (id, date, title, "imgPath", published, "order", "createdAt", "updatedAt") FROM stdin;
cmpe74j99006qgzx1l4kd436w	2023-04-20 13:47:04	산업통상자원부 에너지수요관리핵심기술사업 3차년도 과제 진도회의 (대한기계학회 열공학부문 춘계학술대회)	/legacy/c153cb953644731e198e00420b95da9a_ctQF3iYJ_6d8fe1e2c3bdbd7c8a7f4b80574189becd3e1acf.jpg	t	2	2026-05-20 15:07:43.869	2026-05-20 15:07:43.869
cmpe74j9a006rgzx19swch4uo	2023-04-21 14:03:12	2023 대한기계학회 열공학부문 춘계학술대회	/legacy/c153cb953644731e198e00420b95da9a_Ah68DMux_0198c8c614720f130fe303a640aaca01e0cd1f06.jpg	t	3	2026-05-20 15:07:43.87	2026-05-20 15:07:43.87
cmpe74j9a006sgzx1eg966nus	2023-07-07 11:00:17	산업통상자원부 에너지수요관리핵심기술사업 3차년도 과제 진도회의 (한국유체기계학회 하계학술대회)	/legacy/c153cb953644731e198e00420b95da9a_RgbAFp7Q_a7b6be07ab4e442526d5ce48b41de429a465712e.jpg	t	4	2026-05-20 15:07:43.87	2026-05-20 15:07:43.87
cmpe74j9b006tgzx1a6wbod4b	2023-07-20 22:07:20	7월 20일 연구실 단체사진	/legacy/c153cb953644731e198e00420b95da9a_lrfwzmQp_a42bb67dada1d67fa899de056ab0420fe504c72e.jpg	t	5	2026-05-20 15:07:43.871	2026-05-20 15:07:43.871
cmpe74j9b006ugzx1nfvr2a0n	2023-07-20 22:08:01	7월 20일 연구실 단체사진	/legacy/c153cb953644731e198e00420b95da9a_KFvU4a8V_8a861a964c7272fbd199ca90393b2cf07b5e4df9.jpg	t	6	2026-05-20 15:07:43.871	2026-05-20 15:07:43.871
cmpe74j9e006xgzx1rqc0mlex	2024-08-16 21:47:25	DTC 과제 미국 UIUC 방문 Meeting	/legacy/0f3ba66eb9d874349e0f3e4eb0b6cc8b_tIPgeOR5_56628fba21c1f5afff09ed27693698e6eeeec638.jpg	t	9	2026-05-20 15:07:43.874	2026-05-20 15:07:43.874
cmpe74j9e006ygzx162s579wb	2024-08-29 21:48:01	DTC 과제 국내 Kickoff Meeting	/legacy/0f3ba66eb9d874349e0f3e4eb0b6cc8b_K2ozWAbJ_9b034b81e44f2f5d389e3b405c2ba9cfb651d134.jpg	t	10	2026-05-20 15:07:43.874	2026-05-20 15:07:43.874
cmpe74j9c006vgzx1tlt8s7d8	2024-08-13 14:33:03	8월 13일 초청 세미나	/legacy/598f1cd8c2da1b65e9bf8160c028e616_1724736768_5312.jpg	t	7	2026-05-20 15:07:43.872	2026-06-02 12:40:04.595
cmpe74j9d006wgzx17v3tj0jo	2024-08-23 14:36:09	8월 23일 초청 강연회	/legacy/598f1cd8c2da1b65e9bf8160c028e616_1724736948_7428.jpg	t	8	2026-05-20 15:07:43.873	2026-06-02 12:40:05.957
cmpe74j9f006zgzx1fw7bz3tv	2024-10-16 00:53:21	비등파이프 과제 4차년도 3차 진도회의	/legacy/6ff2638d771b169b7e6be815619c955d_1729612386_6663.jpg	t	11	2026-05-20 15:07:43.875	2026-06-02 12:40:06.875
cmpe74j9g0070gzx1imw7xzcs	2024-10-18 00:54:23	한국유체기계학회 제2회 전자장비냉각 및 열관리 통합 Workshop	/legacy/6ff2638d771b169b7e6be815619c955d_1729612450_3548.jpg	t	12	2026-05-20 15:07:43.876	2026-06-02 12:40:09.06
cmpe74j9h0071gzx1sxwvclzz	2025-04-25 18:12:48	2025 대한기계학회 열공학부문 춘계학술대회	/legacy/42ac65fe9e1a360388a0b1e51c6e6aa0_1751620105_2239.jpg	t	13	2026-05-20 15:07:43.877	2026-06-02 12:40:10.929
cmpe74j9h0072gzx1r93vb7gu	2025-05-15 18:17:30	2025 스승의 날	/legacy/42ac65fe9e1a360388a0b1e51c6e6aa0_1751620640_9267.jpg	t	14	2026-05-20 15:07:43.877	2026-06-02 12:40:14.555
cmpe74j9i0073gzx1qedx57g1	2025-07-04 18:19:29	2025 한국유체기계학회 하계학술대회	/legacy/42ac65fe9e1a360388a0b1e51c6e6aa0_1751620760_9076.jpg	t	15	2026-05-20 15:07:43.878	2026-06-02 12:40:15.408
cmpe74j9j0074gzx1s9f9ft3x	2025-08-12 00:00:00	한국유체기계학회 제3회 전자장비냉각 및 열관리 통합 Workshop	/legacy/04b8342eb26115f0deacb2c73e9efa4e_1755497944_1017.jpg	t	16	2026-05-20 15:07:43.879	2026-06-14 12:47:39.414
\.


--
-- Data for Name: Lecture; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Lecture" (id, num, category, title, paragraphs, published, "order", "createdAt", "updatedAt") FROM stdin;
cmpe74j8w006igzx1xs2fbsxr	02	GRADUATE	Phase-Change Heat Transfer	{"Students will learn a detailed view of\nboiling and condensation phenomena in the phase-change heat transfer lecture.","Different from heat transfer lectures in the\nundergraduate course, this lecture will provide an understanding of two-phase\nflow, basic models and empirical treatments of two-phase flow, pool and\nconvective boiling, subcooled and saturated boiling, and critical heat flux in\nforced convective flow and condensation. These can even solve global problems\nsuch as climate change and energy crisis.","By taking this class, students will gain\nabilities that can be used to solve difficulties with phase-change heat\ntransfer in actual R&D applications."}	t	7	2026-05-20 15:07:43.856	2026-05-20 15:07:43.856
cmpe74j8x006jgzx16hx7nbu9	03	UNDERGRADUATE	Applied Heat Transfer	{"In the applied heat transfer lecture, students\nwill learn about heat transfer fundamentals not encountered in the “Heat\nTransfer” lecture.","The students will study phase-change heat\ntransfer, heat exchanger, radiation heat transfer, heat pipe, and thermal\nmanagement.","Especially technical issues in electric\nvehicles, cooling of the energy storage system (ESS) battery, cooling of the\npower semiconductor in the power conversion system, and cooling of the laser\ndiode in laser weapons will be learned.","This class will give students deeper physical\ninsights applicable to the advanced industrial area."}	t	14	2026-05-20 15:07:43.857	2026-05-20 15:07:43.857
cmpe74j8u006hgzx16z2mgv54	01	UNDERGRADUATE	Heat Transfer	{"Through the heat transfer lecture, the\r\nstudents will learn about the fundamental concepts of heat transfer, such as\r\nconduction, convection, and radiation.","In the conduction part, students can study\r\none-dimensional conduction heat transfer, heat transfer theory, and the application\r\nof both steady- and unsteady-states conductions.","In the convection part, students can study the\r\nbasic theory and application of forced and free convection heat transfer in the\r\ninternal and external flow based on fluid dynamics.","A lot of industrial applications involve\r\nheat generation. Therefore heat transfer is an important variable in applications\r\nlike air conditioners, refrigerators, mobile devices, automobiles, and power\r\nplants.","By taking this class, students will gain useful\r\nknowledge that can be applied to most industrial fields."}	t	3	2026-05-20 15:07:43.854	2026-06-12 10:15:18.811
cmpe74j8y006kgzx1zbzbg90c	04	GRADUATE	Experimental Thermal and Fluid Mechanics	{}	t	15	2026-05-20 15:07:43.858	2026-06-12 10:08:08.665
\.


--
-- Data for Name: LecturesPageMeta; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LecturesPageMeta" (id, "heroHeadline", "heroParagraph", "createdAt", "updatedAt") FROM stdin;
cmqt1vcyb0004ykx1xrd0rusw	Courses taught\r\nby the lab.	Undergraduate and graduate courses on heat transfer, phase-change phenomena, and experimental thermal-fluid mechanics — taught at Ajou University's Department of Mechanical Engineering.	2026-06-25 05:16:52.691	2026-06-25 05:16:52.691
\.


--
-- Data for Name: MembersPageMeta; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."MembersPageMeta" (id, "heroHeadline", "heroParagraph", "createdAt", "updatedAt") FROM stdin;
cmqt1wmkg000bykx16911ejvs	The people behind ATM Lab.	A small principal investigator–led group of postdoctoral researchers, graduate students, and undergraduate interns advancing thermal management research — alongside alumni now working in industry, national labs, and academia.	2026-06-25 05:17:51.808	2026-06-25 05:20:33.293
\.


--
-- Data for Name: News; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."News" (id, date, title, content, published, "order", "createdAt", "updatedAt") FROM stdin;
cmpe74j94006ngzx1n7aares7	2023-02-16 18:22:46	기계 임현묵 교수, 히트 파이프 분야 국제학술대회 ‘베스트 논문상’	<p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; "><img src="/legacy/ruicYdIQmtukckHlELfOJfCODZ.jpg" class="fr-fic fr-dib" alt="ruicYdIQmtukckHlELfOJfCODZ.jpg" width="489" style="box-sizing: border-box; margin: 0px auto; padding: 10px 0px; border: 0px; vertical-align: top; font-size: 1em; max-width: 100%; height: auto; float: none; width: 488.797px;"></p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; "><br style="box-sizing: border-box;"></p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; ">우리 학교 기계공학과 임현묵 연구교수가 히트 파이프 분야 국제 학술대회에서 베스트 논문상을 수상했다.</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; "><br style="box-sizing: border-box;"></p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; ">임현묵 교수(사진 오른쪽)는 &lt;제21차 국제 히트 파이프 컨퍼런스 및 제15차 국제 히트 파이프 심포지엄(Joint 21st International Heat Pipe Conference and 15th International Heat Pipe Symposium, IHPC 및 IHPS)&gt;에서 베스트 논문상(Don Ernst Award)을 받았다.&nbsp;</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; "><br style="box-sizing: border-box;"></p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; ">이번 학술대회는 학회 출범 50주년을 기념해 지난 5일부터 9일까지 호주 멜버른 RMIT대학에서 진행됐다. 해당 학술대회에서는 ▲열 장치 ▲전자 ▲재생 에너지 ▲자동차 ▲항공 우주 ▲열교환기 분야에서 학계 및 업계 전문가들이 모여 전문 지식을 공유하고 최신 연구 결과를 논의했다.</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; "><br style="box-sizing: border-box;"></p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; ">아주대 임현묵 교수는 '고발열 냉각을 위한 평판형 상변화 냉각판 개발(Development of the flat plate two-phase heat spreader for high heat loads)'이라는 논문으로 ‘베스트 논문상’을 수상, 부상으로 상금 500달러를 받았다.</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; "><br style="box-sizing: border-box;"></p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; ">임 교수는 마이크로 다공질 구조를 활용한 비등 열전달 성능 향상 기술을 통해 CPU 크기의 열원을 냉각할 수 있는 상변화 냉각판을 개발했다. 이를 통해 기존의 냉각 방식인 베이퍼 챔버(Vapor chamber)와 비교하여 더 높은 열유속을 확보, 우수하고 안정적인 열관리 성능을 확인했다.&nbsp;</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; "><br style="box-sizing: border-box;"></p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; ">임현묵 교수의 수상 논문은 고발열 냉각이 필요한 ▲전력 반도체 ▲데이터 센터 ▲레이저 다이오드 ▲의료용 전자장비 등의 다양한 산업분야에 확대 적용할 수 있을 것으로 기대된다.</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; "><br style="box-sizing: border-box;"></p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; ">임현묵 교수는 2022년부터 우리 학교 기계공학과 연구교수로 재직하고 있다. 임 교수는 ▲비등을 활용한 상변화 열전달판 개발 ▲리튬 이온 배터리 열관리/열폭주 방지 기술 연구 ▲비등 열전달 성능 향상 등 다양한 연구를 수행하고 있다.</p>	t	5	2026-05-20 15:07:43.864	2026-06-16 05:38:46.112
cmpe74j95006ogzx1ow9iky6l	2023-05-03 11:26:00	기계공학과 교수·학생, '대한기계학회 열공학부문 2023년 춘계학술대회' 수상	<p style="border: 0px; font-family: inherit; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;"><img src="/legacy/OfUWOdpIPTBTkmeMphQODnNNic.png" class="fr-fic fr-dib" data-path="/_attach/ajou/editor-image/2023/05/OfUWOdpIPTBTkmeMphQODnNNic.png" data-size="82221" data-success="true" data-file_name="OfUWOdpIPTBTkmeMphQODnNNic.png" data-width="295" data-alt="screen shot" data-height="199" style="margin: 0px auto; padding: 10px 0px; border: 0px; vertical-align: top; position: relative; max-width: 100%; display: block; float: none; width: 468.375px;">&nbsp;</p><p style="border: 0px; font-family: inherit; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;">우리 학교 기계공학과 김동혁 연구교수와 박사과정 강석경 학생이 '대한기계학회 열공학부문 2023년 춘계학술대회'에서 각각 우수논문상을 수상했다.</p><p style="border: 0px; font-family: inherit; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;"><br></p><p style="border: 0px; font-family: inherit; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;">'대한기계학회 열공학부문 2023년 춘계학술대회'는 지난 4월19일부터 22일까지 부산 파라다이스 호텔에서 개최됐다. 이번 학술대회에서는 총 340여편의 논문이 발표됐다.</p><p style="border: 0px; font-family: inherit; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;"><br></p><p style="border: 0px; font-family: inherit; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;">기계공학과 김동혁 연구교수는 '금 나노 입자의 직접 투입 횟수에 따른 광열치료에 대한 수치적 연구'라는 제목으로 발표했다. 김동혁 교수의 논문은 레이저를 활용한 광열치료(Photothermal Therapy)에서 금 나노 입자(Gold Nanoparticles)의 투입 횟수에 따른 치료 효과에 대한 내용으로, 생체조직에서 발현되는 세포자멸사(Apoptosis)의 발현 온도를 기준으로 종양 내 세포 자멸사의 발현 정도와 치료를 수행함에 따른 종양조직 주변의 정상조직에서 열적 피해량을 정량적으로 확인했다.&nbsp;</p><p style="border: 0px; font-family: inherit; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;"><br></p><p style="border: 0px; font-family: inherit; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;">또한 최종적으로 최적의 치료 효과를 보이는 레이저의 세기와 투입된 금 나노 입자의 부피분율, 그리고 직접 투입 횟수에 대한 정보를 제시해 우수논문상을 수상했다. 논문 지도는 기계공학과 김현정 교수가 맡았다.</p><p style="border: 0px; font-family: inherit; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;"><br></p><p style="border: 0px; font-family: inherit; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;">김동혁 연구교수는 2023년부터 우리학교 기계공학과 연구교수로 재직하고 있다. 김 교수는 ▲금 나노 입자를 활용한 광열 치료 ▲자연 대류 히트싱크의 형상 최적화 ▲이차전지 건조 과정 성능 평가 ▲에어컨 고장 진단 기술 개발 등 다양한 연구를 수행하고 있다.</p><p style="border: 0px; font-family: inherit; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;"><br></p><p style="border: 0px; font-family: inherit; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;">기계공학과 박사과정 강석경 학생은 '작동유체가 써모사이폰의 Confinement 효과에 미치는 영향 연구'이라는 제목으로 발표했다. 강석경 학생의 논문은 상변화 기반 고효율 열전달기기인 써모사이폰의 Confinment 효과에 대한 내용으로 최근 많은 관심을 받고 있는 소형 써모사이폰의 작동 특성을 규명하는데 큰 기여를 할 것으로 기대된다. 논문 지도는 기계공학과 이정호 교수가 맡았다.</p><p style="border: 0px; font-family: inherit; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;"><br></p><p style="border: 0px; font-family: inherit; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;">강석경 학생은 이정호 교수의 첨단 열관리 연구실 소속이며, 고발열 전자장비의 열관리를 보다 효과적으로 관리할 수 있는 방열장치 개발 관련 연구를 수행 중이다.</p><p style="border: 0px; font-family: inherit; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;"><span style="margin: 0px; padding: 0px; border: 0px; color: rgb(44, 130, 201);"><br></span></p><p style="border: 0px; font-family: inherit; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;"><span style="margin: 0px; padding: 0px; border: 0px; color: rgb(44, 130, 201);">#위 사진 설명 : 왼쪽부터 기계공학과 김동혁 연구교수, 기계공학과 박사과정 강석경 학생</span></p><p style="border: 0px; font-family: inherit; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;"><br></p><p style="border: 0px; font-family: inherit; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;"><img src="/legacy/tBufIuqdKsgYvOarhLwRWQRhiH.jpg" class="fr-fic fr-dib" data-path="/_attach/ajou/editor-image/2023/05/tBufIuqdKsgYvOarhLwRWQRhiH.jpg" data-size="57033" data-success="true" data-file_name="tBufIuqdKsgYvOarhLwRWQRhiH.jpg" data-width="701" data-alt="screen shot" data-height="473" style="margin: 0px auto; padding: 10px 0px; border: 0px; vertical-align: top; position: relative; max-width: 100%; display: block; float: none; width: 547.469px;"></p><p style="border: 0px; font-family: inherit; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; text-align: center;"><span style="margin: 0px; padding: 0px; border: 0px; font-size: 14px;">김동혁 연구교수의 연구자료</span><img src="/legacy/iKfdXPtDGbBbcYyRZZzhbwcwmp.png" class="fr-fic fr-dib" data-path="/_attach/ajou/editor-image/2023/05/iKfdXPtDGbBbcYyRZZzhbwcwmp.png" data-size="5003128" data-success="true" data-file_name="iKfdXPtDGbBbcYyRZZzhbwcwmp.png" data-width="2400" data-alt="screen shot" data-height="1619" style="margin: 0px auto; padding: 10px 0px; border: 0px; vertical-align: top; position: relative; max-width: 100%; display: block; float: none; width: 548.688px;"></p><p style="border: 0px; font-family: inherit; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; text-align: center;"><span style="margin: 0px; padding: 0px; border: 0px; font-size: 14px;">박사과정 강석경 학생의 연구자료</span></p><p style="border: 0px; font-family: inherit; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; text-align: center;"><br style="font-family: &quot;Noto Sans KR&quot;, sans-serif; "></p>	t	6	2026-05-20 15:07:43.865	2026-06-16 05:38:46.114
cmpe74j91006lgzx1kcax21y7	2021-06-28 18:21:11	이정호 교수팀, 총사업비 135억 규모 산업통상자원부 에너지기술사업 선정	<p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;  text-align: justify;"><img src="/legacy/qutpopgfdLgZHQFgVQpRsNKGbq.jpg" class="fr-fic fr-dib" alt="qutpopgfdLgZHQFgVQpRsNKGbq.jpg" width="856" style="box-sizing: border-box; margin: 0px auto; padding: 10px 0px; border: 0px; vertical-align: top; font-size: 1em; max-width: 100%; height: auto; float: none; width: 855.953px;"></p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;  text-align: center;">&nbsp;</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;  text-align: justify;">우리 학교 기계공학과 이정호 교수 연구팀이 산업통상자원부의&nbsp;‘2021년도 제1차 에너지기술개발사업’에 주관연구기관으로 선정됐다.</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;  text-align: justify;">&nbsp;&nbsp;</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;  text-align: justify;">산업통상자원부는 에너지 환경 변화에 대응하여 탄소중립 시대 실현과 그린뉴딜 사업을 위한 기술개발을 촉진하기 위해&nbsp;▲신재생&nbsp;▲에너지신산업&nbsp;▲청정화력/원자력/스마트그리드&nbsp;▲공공R&amp;D&nbsp;분야에서&nbsp;80개의 세부사업을 진행하고 있다. 119개 상당의 과제에&nbsp;1950억여원이 투입되는 대규모 사업이다.</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;  text-align: justify;">&nbsp;&nbsp;</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;  text-align: justify;">이정호 교수(사진 왼쪽)는 세부사업 부문 중&nbsp;&lt;에너지 수요관리 핵심 기술개발 사업&gt;의&nbsp;‘비등을 이용한 히트파이프 열교환기 성능 향상 핵심 기술 및 모듈 개발’에 지원해 최종 선정됐다.&nbsp;사업 기간은&nbsp;2021년&nbsp;5월부터&nbsp;2025년&nbsp;12월까지&nbsp;5년이며,&nbsp;총 사업비는&nbsp;135억원이다.</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;  text-align: justify;">&nbsp;&nbsp;</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;  text-align: justify;">히트파이프는 외부 에너지를 사용하지 않고 효율적으로 열을 전달하는 장치로,&nbsp;히트파이프 열교환기는 고온부와 저온부 사이에 위치한 히트파이프를 통해 열을 교환하는 역할을 한다.&nbsp;구조가 간단하고 열에 의한 변형이 발생하지 않는 특성을 지니고 있어 폐열회수용 열교환기 및 항공/우주 분야에서의 냉각 및 열교환 시스템에 활용되고 있다.</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;  text-align: justify;">&nbsp;&nbsp;</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;  text-align: justify;">이정호 교수 연구팀(사진 오른쪽)은 이번 사업을 통해 비등파이프 열교환기를 개발할 계획이다.&nbsp;비등파이프는 액체가 끓어오르는&nbsp;‘비등’&nbsp;열전달 기술을 적용하여 증발에만 의존하는 기존 히트파이프의 열교환 성능 한계를 극복할 수 있다.&nbsp;비등을 이용한 열전달 기술은 전력반도체,&nbsp;전기자동차 및 에너지저장장치(ESS),&nbsp;그리고 레이저 유도무기의 냉각장치와 같은 첨단 고발열 열관리를 위한 핵심 기술로 주목받고 있다.</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;  text-align: justify;">&nbsp;&nbsp;</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;  text-align: justify;">연구팀은 이번 연구를 통해 발전플랜트,&nbsp;보일러,&nbsp;소각로 등 각종 산업 현장에서의 에너지 비용 절감 및 온실가스 감축에 기여할 뿐만 아니라 대부분 버려지고 있는 중소 규모의 폐열회수에 따른 사회 간접적 에너지 비용을 감소시킬 수 있을 것으로 기대하고 있다.</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;  text-align: justify;">&nbsp;&nbsp;</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;  text-align: justify;">이번 사업을 맡은 이정호 교수는 지난&nbsp;3월 우리 학교 기계공학과 교수로 임용되었다.&nbsp;이 교수는 첨단 방열 및 열관리 기술 분야 국내 최고 전문가 중 한 명으로,&nbsp;지난&nbsp;25여 년 간 열 시스템 방열 및 열관리 기술을 개발해왔다.</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;  text-align: justify;">&nbsp;&nbsp;</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;  text-align: justify;">한편 우리 대학이 주관연구기관을 맡은 이번 사업에는 한국기계연구원, 중앙대학교 산학협력단, 울산과학기술원, 한국과학기술원, (주)유니웰이 참여연구기관으로 참여한다.</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;  text-align: justify;"><br style="box-sizing: border-box;"></p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px;  text-align: center;"><img src="/legacy/BbZTpgtuxJifZsMlMhlgjPkQTE.png" class="fr-fic fr-dib" alt="BbZTpgtuxJifZsMlMhlgjPkQTE.png" width="679" style="box-sizing: border-box; margin: 0px auto; padding: 10px 0px; border: 0px; vertical-align: top; font-size: 1em; max-width: 100%; height: auto; float: none; width: 679.438px;"><span style="box-sizing: border-box; margin: 0px; padding: 0px; border: 0px; font-size: 14px; color: rgb(71, 85, 119);">&lt;비등파이프 열교환기 자료&gt;</span></p>	t	3	2026-05-20 15:07:43.861	2026-06-16 05:38:46.08
cmpe74j96006pgzx1yrwcdpgu	2024-08-16 00:00:00	기계 이정호 교수팀, 산업부 연구사업 선정. 데이터센터 열관리 기술 연구 나서	<p>우리 학교 기계공학과<span style="color:rgb(0, 0, 0)"> 이정호 교수 </span>연구팀이 산업통상자원부가 지원하는 ‘2024년도 에너지 국제 공동 연구사업’에 선정됐다.</p><p><br /></p><p>에너지 국제 공동 연구사업은 다른 국가나 기관과 함께 에너지 R&amp;D를 공동으로 수행하고 기술협력을 활성화하는 것을 목표로, 기술격차 해소가 필요하거나 상호보완적인 기술개발 분야를 대상으로 기술 선진국과의 공동연구를 지원한다.</p><p><br /></p><p>이정호 교수 연구팀은 ‘고밀도 데이터센터 Direct-to-Chip 열관리 기술 및 Server-Rack 운영기술 개발(Direct-to-Chip Thermal Management and Server-Rack Operation Technology for High-density Data Center)’이라는 연구 주제로 2024년부터 2027년까지 3년 동안 공동연구를 수행하게 된다. 지원받는 연구비 규모는 약 41억원이다.</p><p><br /></p><p>이번 과제에는 아주대학교가 주관 연구개발 기관으로 참여하며, 국내 공동 연구개발 기관으로 ▲KAIST ▲UNIST ▲중앙대학교 ▲㈜삼진테크, 국제 공동 연구개발기관으로는 ▲미국 스탠포드대학(Stanford University) ▲미국 일리노이대학(University of Illinois at Urbana-Champaign, UIUC)이 참여한다.</p><p><br /></p><p>최근 AI 기술의 급격한 발전에 따라 AI 칩렛(Chiplet)이 적용되면서 데이터센터의 GPU 파워는 현재 700 와트에서 2027년 1500 와트 수준으로 가파르게 증가할 전망이다. 이에 따른 데이터센터의 고발열 칩셋(Chipset)을 효과적으로 냉각할 수 있는 열관리 기술로 ‘액체를 이용하여 칩을 직접적으로 냉각할 수 있는 Direct-to-Chip(DTC) 냉각 기술’이 요구된다.</p><p><br /></p><p>공동 연구팀은 이번 연구를 통해 첨단 미래 산업의 핵심 요소인 데이터센터의 고발열 칩셋을 효율적으로 직접 냉각하는 다양한 DTC(Direct-to-Chip) 액체 냉각용 냉각판(Cold Plate)을 개발하고 이를 기반으로 서버랙(Server-Rack) 단위의 냉각 솔루션과 운영 최적화 기술을 개발할 계획이다. 또한, 데이터센터 직접 칩 냉각(Direct-to-Chip Cooling)을 적용한 서버렉(Server-Rack) 시작품을 제작하여 시스템의 전력 소모 유용도(PUE)를 측정하고 평가할 계획이다. </p><p><br /></p><p>이정호 교수는 "현재 국내의 경우, 데이터 센터용 칩셋 개발은 걸음마 단계에 있으며, 서버랙 업체는 전무한 실정이지만, 데이터센터 열관리에 관련한 핵심 원천 요소기술은 국내에서도 충분히 개발할 수 있을 것"이라며 "이번 공동 연구를 통해 연구원과 학생들을 국제 공동 연구개발기관에 파견, 미국이 선도하고 있는 데이터센터 열관리 관련 기술을 습득할 수 있을 것"이라고 말했다.</p><p><br /></p><p>이어 "현재 미국이 주도하고 있는 데이터센터 열관리 기술을 넘어설 수 있는 DTC 원천 기술을 개발해 데이터센터 열관리 핵심 요소기술을 사업화할 수 있는 토대를 마련하겠다"라고 덧붙였다. </p><p><br /></p><p><br /></p><p></p><img src="/legacy/1a03daa8959303f85e62b326acc36c8b_1723771356_8454.jpg" /><p><strong>&lt;이정호 교수팀의 주요기술에 대한 설명&gt;</strong></p><p><br /></p><img src="/legacy/1a03daa8959303f85e62b326acc36c8b_1723771410_3768.jpg" /><p><br /><strong>&lt;이정호 교수팀의 주요기술에 대한 설명&gt;</strong> </p><p><br /></p>	t	8	2026-05-20 15:07:43.866	2026-06-17 05:44:52.99
cmpe74j93006mgzx1b8hcudqn	2022-07-20 18:21:48	대학원 기계공학과 도수윤 학생, '한국유체기계학회 하계학술대회' 우수논문상 수상	<p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; "><img src="/legacy/umVtCRPHNJMxLxEjKBjFboSycG.jpg" class="fr-fic fr-dib" alt="umVtCRPHNJMxLxEjKBjFboSycG.jpg" width="800" style="box-sizing: border-box; margin: 0px auto; padding: 10px 0px; border: 0px; vertical-align: top; font-size: 1em; max-width: 100%; height: auto; float: none;"></p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; "><br style="box-sizing: border-box;"></p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; ">우리 학교 기계공학과 석박사통합과정 도수윤 학생이 '2022년 한국유체기계학회 하계학술대회'에서 우수논문상을 수상했다.</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; "><br style="box-sizing: border-box;"></p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; ">'2022년 한국유체기계학회 하계학술대회'는 지난 6월29일부터 7월1일까지 강원도 휘닉스 평창에서 열렸다. 이번 학술대회에서는 ▲환경플랜트 ▲선박/해양에너지 ▲열관리 등 14개 분야에서 190여편의 논문이 발표됐다.</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; "><br style="box-sizing: border-box;"></p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; ">우리 학교 도수윤 학생은 '마이크로 두께 구리폼의 풀 비등 열전달에 대한 경사각의 영향'이라는 제목으로 발표, 우수논문상 수상의 영광을 안았다.</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; "><br style="box-sizing: border-box;"></p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; ">논문은 폼 형태의 구리(Copper foam)의 높은 비등 열전달 특성에 대한 내용을 담고 있다. 구리폼은 상변화 열전달판(Thermal ground plane, TGP)의 비등 특성도 향상시키며 전력반도체, 레이저 다이오드(Laser-diode) 등의 고발열 전자장비 냉각에 이를 활용할 수 있을 것으로 기대된다. 논문 지도는 기계공학과 이정호 교수가 맡았다.</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; "><br style="box-sizing: border-box;"></p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; ">도수윤 학생이 소속된 이정호 교수의 첨단 열관리 연구실은 고발열 전자장비의 열관리를 보다 효과적으로 관리할 수 있는 방열장치 개발 관련 연구를 수행 중이다.</p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; "><br style="box-sizing: border-box;"></p><p style="box-sizing: border-box; word-break: keep-all; border: 0px; font-family: &quot;Noto Sans KR&quot;, sans-serif; font-size: 17px; color: rgb(51, 51, 51); line-height: 25px; ">한편, 한국유체기계학회는 국내 유체기계 발전 및 관련 분야 연구·정보교류 활성화를 위하여 1996년에 설립된 학술단체이다.</p>	t	4	2026-05-20 15:07:43.863	2026-06-16 05:38:46.102
\.


--
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Project" (id, title, institution, period, scale, status, published, "order", "createdAt", "updatedAt") FROM stdin;
cmpe74j4f000pgzx16hilc206	상변화 열확산판이 내장된 레이저 발진기 냉각판과 냉각유로 내부 표면 개질 연구	Hyundai Rotem Co.	2023.08.01~2025.07.31	₩300,000,000	ACTIVE	t	14	2026-05-20 15:07:43.695	2026-05-20 15:07:43.695
cmpe74j4j000tgzx1larbtmy2	상변화 냉각판을 적용한 레이저 발생장치 고효율 냉각 연구	Hyundai Rotem Co.	2021.07.15.~2022.06.16.	₩49,999,200	COMPLETED	t	2	2026-05-20 15:07:43.699	2026-05-20 15:07:43.699
cmpe74j4g000qgzx1ochzmftn	소형 레이저발진기 냉각시스템 설계 기술	LIG Nex1 Co.	2023.11.01~2025.10.31	₩150,000,000	ACTIVE	t	15	2026-05-20 15:07:43.696	2026-06-11 14:56:30.973
cmpe74j4h000rgzx11e2bs4u9	Direct-to-Chip Thermal Management and Server-Rack Operation Technology for High-density Data Center	Korea Energy Technology Evaluation and Planning (KETEP)	2024.07.01.~2027.06.30.	₩4,116,849,000	ACTIVE	t	16	2026-05-20 15:07:43.697	2026-06-11 15:05:09.442
cmpe74j4h000sgzx14zbgdpl2	배터리 냉각용 등온 냉각판 특성 연구	Hyundai Mobis Co.	2025.06.01~2026.12.31	₩250,000,000	ACTIVE	t	17	2026-05-20 15:07:43.697	2026-06-11 15:05:11.912
cmpe74j4k000ugzx1nkkgttu6	Design and Manufacturing Technologies for a Thin Thermal Ground Plane	Institute of Civil Military Technology Cooperation (ICMTC)	2021.12.01. ~ 2023.11.30.	₩1,901,000,000	COMPLETED	t	4	2026-05-20 15:07:43.7	2026-05-20 15:07:43.7
cmpe74j4l000vgzx13h7w2dpd	Phase-Change Heat Transfer Enhancement for Gas-to-Water Heat Pipe Heat Exchanger	National Research Foundation of Korea (NRF)	2020.03.01. ~ 2025.02.28.	₩2,000,000,000	COMPLETED	t	5	2026-05-20 15:07:43.701	2026-05-20 15:07:43.701
cmpe74j4l000wgzx1q2f912ir	Liquid Cooling-type Thermal Management for Battery Energy Storage Systems (BESS)	Korea Midland Power Co. (KOMIPO)	2022.12.23 ~ 2025.3.20	1,000,000,000	COMPLETED	t	6	2026-05-20 15:07:43.701	2026-05-20 15:07:43.701
cmpe74j4e000ogzx1rybgoa29	Core Technology and Module Development in Boiling-type Heat Pipe Heat Exchanger	Korea Energy Technology Evaluation and Planning (KETEP)	2021.05.01.~2025.12.31.	₩13,568,087,000	ACTIVE	t	8	2026-05-20 15:07:43.694	2026-06-16 04:36:13.494
\.


--
-- Data for Name: ProjectsPageMeta; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ProjectsPageMeta" (id, "heroHeadline", "heroParagraph", "createdAt", "updatedAt") FROM stdin;
cmqt1viao0008ykx193pkwycn	Funded research,\r\nin flight and shipped.	A snapshot of the grants currently driving the lab's experimental work, alongside completed contracts that produced the apparatus, surfaces, and devices \r\n\r\nwe still build on.	2026-06-25 05:16:59.616	2026-06-25 05:27:14.286
\.


--
-- Data for Name: PublicationsPageMeta; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PublicationsPageMeta" (id, "heroHeadline", "heroParagraph", "createdAt", "updatedAt") FROM stdin;
cmqt1vfxo0006ykx1wsv9cmmz	The lab's\r\npublished record.	Peer-reviewed journal articles, conference papers, and patents produced by ATM Lab and our collaborators. Filter by category and year.	2026-06-25 05:16:56.556	2026-06-25 05:19:07.27
\.


--
-- Data for Name: ResearchPageMeta; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ResearchPageMeta" (id, "heroHeadline", "heroParagraph", "yearsValue", "createdAt", "updatedAt") FROM stdin;
cmpv1c15c0000rnx12c86g29k	Engineering heat at every scale.	ATM Lab investigates phase-change heat transfer across four interlocking research thrusts — from fundamental boiling and condensation physics to deployable thermal solutions for data centers, waste-heat recovery, and high-flux electronics. Each topic combines experimental rigs, surface engineering, and system-level integration.	10+	2026-06-01 09:57:40.944	2026-06-25 12:46:01.517
\.


--
-- PostgreSQL database dump complete
--



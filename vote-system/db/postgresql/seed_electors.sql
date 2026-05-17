BEGIN;

-- Electors from the provided list.
-- voter_code is normalized for login / lookup.
-- national_id keeps the original IM format when it was provided.
-- Temporary voter codes are used only for rows where the source list did not include an IM.

INSERT INTO electors (voter_code, national_id, full_name, promotion_label) VALUES
('276210', '276 210', 'RANJASIVOLA Harilala Maminirina', '2e PROMOTION'),
('276211', '276 211', 'RAVALINIARIVO Lantoaridera Marcia', '2e PROMOTION'),
('276212', '276 212', 'RAVONINJATOVO H Domoina', '2e PROMOTION'),
('276213', '276 213', 'RAMANIBOLA Haingo', '2e PROMOTION'),
('276214', '276 214', 'RAMENJALIFARA Rinalizah', '2e PROMOTION'),
('276215', '276 215', 'RAJAONARIVO Tahiry', '2e PROMOTION'),
('276216', '276 216', 'RAMANANARIVO Heriniaina A', '2e PROMOTION'),
('276217', '276 217', 'RAZAFIMANDIMBY R.I Eva', '2e PROMOTION'),
('276218', '276 218', 'RAZAFIMANDIMBY R.I Sadiah', '2e PROMOTION'),
('276221', '276 221', 'MAHATRATRA Joseph Bien aimé', '2e PROMOTION'),
('276222', '276 222', 'RAKOTONANDRASANA Charly', '2e PROMOTION'),
('276224', '276 224', 'ANDRIANTOMPONERA Fanomezantsoa', '2e PROMOTION');

INSERT INTO electors (voter_code, national_id, full_name, promotion_label) VALUES
('289268', '289 268', 'RAHANTAVOLOLONA Honorine', '3e PROMOTION'),
('289257', '289 257', 'LANANA Marcelle Claudia', '3e PROMOTION'),
('289256', '289 256', 'HERITIANA Viviane Olivia', '3e PROMOTION'),
('289258', '289 258', 'RAHARIMALALA Vololonjanahary Anicette', '3e PROMOTION'),
('289261', '289 261', 'RANARISON Hanitriniaina', '3e PROMOTION'),
('289262', '289 262', 'RANDRIAMAHAFEHY Hortensia', '3e PROMOTION'),
('289269', '289 269', 'BETOTO Zafisoa Paulette', '3e PROMOTION'),
('289260', '289 260', 'RAMAHANDRISOA Harimbelo', '3e PROMOTION'),
('289267', '289 267', 'RANDRIANARISOA Lanto Hollande', '3e PROMOTION');

INSERT INTO electors (voter_code, national_id, full_name, promotion_label) VALUES
('283533', '283533', 'RAKOTOMAHEFASOA Henriot', '4e PROMOTION'),
('300148', '300148', 'ANDRIANAIVOSON Anthony', '4e PROMOTION'),
('300149', '300149', 'JEAN ANDRIATAHIANA Bernadin', '4e PROMOTION'),
('300150', '300150', 'LAMBO Mbolanirina Nadia', '4e PROMOTION'),
('300151', '300151', 'NAMBOHOE Venon Yolandine', '4e PROMOTION'),
('300152', '300152', 'RAHANTARISOA Samueline Rosette', '4e PROMOTION'),
('300153', '300153', 'RAKOTOMALALA François Hermenegilde', '4e PROMOTION'),
('300156', '300156', 'RANAIVOSON Mamitiana Olivia', '4e PROMOTION'),
('300158', '300158', 'RANDRIANARISOA Valonirina', '4e PROMOTION'),
('300159', '300159', 'RARIVOJAONA Andrianirina Njara', '4e PROMOTION'),
('300160', '300160', 'RAZAFIMAHAFALY Andrianantanarivo Séraphin', '4e PROMOTION'),
('300161', '300161', 'ROBISON Haingo Harivelo', '4e PROMOTION'),
('300162', '300162', 'VOAHANGINIAINA Zinaha', '4e PROMOTION');

INSERT INTO electors (voter_code, national_id, full_name, promotion_label) VALUES
('347540', '347 540', 'RASOLOFOMANDIMBY Fifaliana Nomenahary', '5e PROMOTION'),
('347545', '347545', 'TSINJOARIVONY Ioty Nierenana', '5e PROMOTION'),
('347327', '347 327', 'RAKOTOSON FANOMEZANTSOA Gilchrist', '5e PROMOTION'),
('347538', '347538', 'RANDRIAMAMPIANINA Iangotiana Enintsoa Valimbavaka', '5e PROMOTION'),
('347541', '347541', 'RAVELONARIVO Ando', '5e PROMOTION'),
('347544', '347544', 'TAMOHA Zafisolo Adriannie Iavitsara', '5e PROMOTION'),
('347532', '347 532', 'RAKOTOARISOA Tiavina Nandrianina', '5e PROMOTION'),
('347536', '347 536', 'RALAIMAZAVA Barnabé Ghislain', '5e PROMOTION'),
('347537', '347 537', 'RAMALANJAONA Andrianandraina Claudie', '5e PROMOTION'),
('347531', '347 531', 'RAHERIMALALA Fenosoa Hortense', '5e PROMOTION'),
('347533', '347 533', 'RAKOTOARIMANANA Nantenaina Fabien', '5e PROMOTION'),
('347535', '347 535', 'RAKOTOVOLOLONA Onivola Tahina', '5e PROMOTION'),
('302448', '302448', 'ANDRIANIRINA Falimalala', '5e PROMOTION'),
('347546', '347 546', 'TSIRINIAINA Michael', '5e PROMOTION'),
('347534', '347.534', 'RAKOTOMALALA Lantoniaina Fanny', '5e PROMOTION'),
('347543', '347 543', 'RAZAFINDRAMIARANA Fanomezana Aina', '5e PROMOTION'),
('347530', '347 530', 'MARLASON Francklin', '5e PROMOTION'),
('347528', '347528', 'ANDRIAMIHARIMANANA Lanto Herisoa', '5e PROMOTION'),
('347539', '347 539', 'RANDRIAMANANTENA Jean Claude', '5e PROMOTION'),
('347529', '347 529', 'BE Christophe', '5e PROMOTION'),
('256073', '256 073', 'RANDRIAMANANTSOA Herinjatovo Mamy', '5e PROMOTION'),
('347542', '347 542', 'RAVOLAHAJAMANANA Hobisoa Lydie Ismaël', '5e PROMOTION');

INSERT INTO electors (voter_code, national_id, full_name, promotion_label) VALUES
('353685', '353 685', 'RASOLOFOARISOA Misa', '6e PROMOTION'),
('353680', '353 680', 'RAJOHNSON Tiava Ny Kanto', '6e PROMOTION'),
('TEMP-6-LALAINA', NULL, 'RANDRIAMASY Lalaina', '6e PROMOTION'),
('353682', '353 682', 'RAKOTOMAHEFA Sitraka Zarasoa', '6e PROMOTION'),
('353687', '353 687', 'ZAFIMIARY Rufin', '6e PROMOTION'),
('322868', '322 868', 'RANDRIAMIARAMAHEFA Andriniaina', '6e PROMOTION'),
('353683', '353 683', 'RAZAFINIMANANA Harisoa Faniry', '6e PROMOTION'),
('302453', '302 453', 'ANONA Allendy', '6e PROMOTION'),
('297308', '297 308', 'RAMAROSON Andry', '6e PROMOTION'),
('353681', '353 681', 'RAMAMONJISON Rosemine Celestina', '6e PROMOTION'),
('353684', '353 684', 'RATEFINANAHARY Rantoarivola', '6e PROMOTION'),
('353686', '353 686', 'RAMANGARISON Haingotiana Ida', '6e PROMOTION'),
('353689', '353 689', 'RAKOTOBE Mamitiana Annick', '6e PROMOTION'),
('293367', '293 367', 'RAVERONIRINA Harimbola Sahondra', '6e PROMOTION'),
('302451', '302 451', 'OLILALAINA Vola tatamo', '6e PROMOTION'),
('302458', '302 458', 'RENARIVAHOAKA Toky Fanantenana', '6e PROMOTION');

INSERT INTO electors (voter_code, national_id, full_name, promotion_label) VALUES
('383717', '383 717', 'Rakotoarivelo Lalao Lantonirina', '7e PROMOTION'),
('383710', '383 710', 'Tsitoheriniaina Maria Adolphine Annicke', '7e PROMOTION'),
('383712', '383712', 'Rakotomanana Andrianina Miora', '7e PROMOTION'),
('383713', '383 713', 'Andrianarison Marie Francia', '7e PROMOTION'),
('383711', '383 711', 'Randriamasy Sitraka Ambinintsoa', '7e PROMOTION'),
('250672', '250 672', 'Randrianarison Solohery', '7e PROMOTION'),
('306491', '306 491', 'Razafitsitairana Jean Harlain', '7e PROMOTION'),
('383715', '383 715', 'Rakotosolofo Heriniaina Roland', '7e PROMOTION'),
('383719', '383 719', 'Razanajatovo Andrianarisoa Nirina', '7e PROMOTION'),
('383721', '383 721', 'Ramiadason Henintsoa Yannick', '7e PROMOTION'),
('383716', '383 716', 'Rajaonarison Adonia Denisse', '7e PROMOTION'),
('383722', '383 722', 'Rakotoarisoa Diana Safira', '7e PROMOTION'),
('383723', '383 723', 'Rakotovao Rondrolalaina Volatiana', '7e PROMOTION'),
('302450', '302 450', 'ANDRIAMAROELINA Haingonavalona Karmen', '7e PROMOTION'),
('383720', '383 720', 'Andriamampianina Zo AINA', '7e PROMOTION');

INSERT INTO electors (voter_code, national_id, full_name, promotion_label) VALUES
('365174', '365 174', 'RAJAOFENO Honorelle', '8e PROMOTION'),
('410696', '410 696', 'RAKOTOTIANA Radomanana', '8e PROMOTION'),
('410703', '410 703', 'ANDRIANARIVELO Eugénie Felanirina', '8e PROMOTION'),
('410694', '410 694', 'RABIBISOA Noël Bienvenu', '8e PROMOTION'),
('410690', '410 690', 'FANOMEZANTSOA Natolotriniaina Herizo', '8e PROMOTION'),
('335878', '335 878', 'RANDRIANARIVONY Herizo Mahefa', '8e PROMOTION'),
('345181', '345 181', 'BEMANJARY Fahandriana Lidorice', '8e PROMOTION'),
('410697', '410 697', 'RALOHOTSY Tovonjato Mamy', '8e PROMOTION'),
('410691', '410 691', 'HERIMALALA Jimmy', '8e PROMOTION'),
('410706', '410 706', 'RAKOTOMENJANAHARY Sandratrarivony Setrarivo', '8e PROMOTION'),
('410705', '410 705', 'MAHALANONA Luc Teddy', '8e PROMOTION'),
('410702', '410 702', 'ANDRIAMBOLOLNIAINA Sedera Manohisoa', '8e PROMOTION'),
('410707', '410 707', 'RANDRIAMIFIDY Holy', '8e PROMOTION'),
('410699', '410 699', 'RANDRIAMANDIMBY Lova Nantenaina Tahirisoa', '8e PROMOTION'),
('410709', '410 709', 'RASOLOFONDRAHANTA Lanto Harilahatra', '8e PROMOTION'),
('410708', '410 708', 'RAOBY TODISOA Manjatomanana', '8e PROMOTION'),
('410100', '410 100', 'ANDRIAMBOLOLONA Fetra Nantenaina', '8e PROMOTION'),
('410695', '410 695', 'RAKOTONIRINA Aurore Stéphanie', '8e PROMOTION');

INSERT INTO electors (voter_code, national_id, full_name, promotion_label) VALUES
('447533', '447 533', 'RATSIMBAZAFY Hantanirina', '9e PROMOTION'),
('447540', '447 540', 'RAJAOMANODIARIVELO Fredis Reynaldinoh', '9e PROMOTION'),
('447526', '447 526', 'SITRAKAINA Mananandro', '9e PROMOTION'),
('335882', '335 882', 'RAMAROMANANA Miariniaina', '9e PROMOTION'),
('335859', '335 859', 'RAZANADRAKOTO Hasindrojohanitra Haingovololona Fleurie Laurencia', '9e PROMOTION'),
('447527', '447 527', 'RABEKIJANA Anjara Tsilavina Prisca', '9e PROMOTION'),
('322855', '322 855', 'RABARIMANANA Jeannot Fidèle', '9e PROMOTION'),
('447537', '447 537', 'SAFIDINARINDRA Herilanja Judith', '9e PROMOTION'),
('447534', '447 534', 'RAJAONA Andriamaharo Andomalala Gabriella', '9e PROMOTION'),
('447536', '447 536', 'RAKOTOVAO Domohina', '9e PROMOTION'),
('447535', '447 535', 'ANDRIANKASINA Hanitrarivelo Rindra', '9e PROMOTION'),
('447529', '447 529', 'RAMANAKIRAHINA Fetra Herisoa', '9e PROMOTION'),
('447528', '447 528', 'RAZAFIMAHATRATRA Maminiaina Eric', '9e PROMOTION'),
('447588', '447 588', 'RANDRIANANDRASANA Jaona', '9e PROMOTION'),
('447524', '447 524', 'RAKOTOBE Liantsoa Miadanarivelo', '9e PROMOTION'),
('447525', '447 525', 'RAZAFINDRAKOPY Kemba Floria Adeline', '9e PROMOTION'),
('322875', '322 875', 'RATOVONDRAINY Faravavy Mariette', '9e PROMOTION'),
('447541', '447 541', 'RAFARALAHIVELO Ella Irmina Marie Olga', '9e PROMOTION'),
('447539', '447 539', 'RAKOTONIRINA Fanomezantsoa Dina Andrianina', '9e PROMOTION'),
('343390', '343 390', 'RANJALAHY Georgius Garsis', '9e PROMOTION'),
('322852', '322 852', 'HENINTSOA Jean Felix Hervé', '9e PROMOTION'),
('001001', '001 001', 'RANDRIANATONDRO Lucas Richard', '9e PROMOTION');

COMMIT;
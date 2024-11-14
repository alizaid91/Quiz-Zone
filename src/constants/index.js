import {
  gK,
  animals,
  anime,
  books,
  comic2,
  computer,
  films,
  mathematics,
  music,
  science,
  sports,
  video_game,
  accuracyIcon,
  challengeIcon,
  checkIcon,
  questionIcon,
  removeIcon,
} from "../assets";

import { GitHub, Instagram, LinkedIn } from "../assets/svg/SocialMediaLogos";

export const categories = [
  {
    name: "Mathematics",
    id: 19,
    thumbImg: mathematics,
  },
  {
    name: "Animals",
    id: 27,
    thumbImg: animals,
  },
  {
    name: "Anime",
    id: 31,
    thumbImg: anime,
  },
  {
    name: "Computers",
    id: 18,
    thumbImg: computer,
  },
  {
    name: "Comics",
    id: 29,
    thumbImg: comic2,
  },
  {
    name: "Music",
    id: 12,
    thumbImg: music,
  },
  {
    name: "Books",
    id: 10,
    thumbImg: books,
  },
  {
    name: "Films",
    id: 11,
    thumbImg: films,
  },
  {
    name: "General Knowledge",
    id: 9,
    thumbImg: gK,
  },
  {
    name: "Video Games",
    id: 15,
    thumbImg: video_game,
  },
  {
    name: "Science",
    id: 17,
    thumbImg: science,
  },
  {
    name: "Sports",
    id: 21,
    thumbImg: sports,
  },
];

export const socialLogos = [
  {
    name: "LinkedIn",
    logo: LinkedIn,
    color: ["#0077B5"],
    url: "https://in.linkedin.com/in/alizaid91",
  },
  {
    name: "GitHub",
    logo: GitHub,
    color: ["#2b3137"],
    url: "https://github.com/alizaid91",
  },
  {
    name: "Instagram",
    logo: Instagram,
    color: ["#833ab4", "#fd1d1d", "#fcb045"],
    url: "https://www.instagram.com/alizaid291/",
  },
];

export const resultSummaryCard = [
  {
    title: "Total Questions",
    icon: questionIcon,
  },
  {
    title: "Attempted",
    icon: challengeIcon,
  },
  {
    title: "Correct",
    icon: checkIcon,
  },
  {
    title: "Accuracy",
    icon: accuracyIcon,
  },
  {
    title: "Incorrect",
    icon: removeIcon,
  },
];

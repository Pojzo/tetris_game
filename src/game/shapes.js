const cobaltBlue  = [3, 65, 174];
const apple       = [114, 203, 59];
const cyberYellow = [255, 213, 0];
const beer 	      = [255, 151, 28];
const RYBRed 	  = [255, 50, 19];

export const pieceStrings = ['I', 'J', 'L', 'O', 'S', 'T'];
export const pieceColors = [cobaltBlue, apple, cyberYellow, beer, RYBRed];

export const I = [
	[
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	],
	[
		[0, 0, 1, 0],
		[0, 0, 1, 0],
		[0, 0, 1, 0],
		[0, 0, 1, 0],
	],
	[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
	],
	[
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
	]
];


export const J = [
	[
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 1, 1],
		[0, 1, 0],
		[0, 1, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 1],
		[0, 0, 1]
	],
	[
		[0, 1, 0],
		[0, 1, 0],
		[1, 1, 0]
	]
];

export const L = [
	[
		[0, 0, 1],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 1]
	],
	[
		[1, 1, 1],
		[1, 0, 0]
	],
	[
		[1, 1, 0],
		[0, 1, 0],
		[0, 1, 0]
	]
];

export const O = [
	[
		[1, 1],
		[1, 1]
	],
	[
		[1, 1],
		[1, 1]
	],
	[
		[1, 1],
		[1, 1]
	],
	[
		[1, 1],
		[1, 1]
	]


];

export const S = [
	[
		[0, 1, 1],
		[1, 1, 0],
		[0, 0, 0]
	],
	[
		[0, 1, 0],
		[0, 1, 1],
		[0, 0, 1]
	],
	[
		[0, 0, 0],
		[0, 1, 1],
		[1, 1, 0]
	],
	[
		[1, 0, 0],
		[1, 1, 0],
		[0, 1, 0]
	]
];

export const T = [
	[
		[0, 1, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 1, 0],
		[0, 1, 1],
		[0, 1, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 1],
		[0, 1, 0]
	],
	[
		[0, 1, 0],
		[1, 1, 0],
		[0, 1, 0]
	]
];

export const Z = [
	[
		[1, 1, 0],
		[0, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 0, 1],
		[0, 1, 1],
		[0, 1, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 0],
		[0, 1, 1]
	],
	[
		[0, 1, 0],
		[1, 1, 0],
		[1, 0, 0]
	]
];

export const ICut = [
	[1, 1, 1, 1]
];

export const JCut = [
	[1, 0, 0],
	[1, 1, 1],
];

export const LCut = [
	[0, 0, 1],
	[1, 1, 1]
];

export const OCut = [
	[1, 1],
	[1, 1]
];

export const SCut = [
	[0, 1, 1],
	[1, 1, 0],
];

export const TCut = [
	[0, 1, 0],
	[1, 1, 1],
];


export const ZCut = [
	[1, 1, 0],
	[0, 1, 1],
]

export const IWidth = 4;
export const JWidth = 3;
export const LWidth = 3;
export const OWidth = 2;
export const SWidth = 3;
export const TWidth = 3;
export const ZWidth = 3;

export const IHeight = 1;
export const JHeight = 2;
export const LHeight = 2;
export const OHeight = 2;
export const SHeight = 2;
export const ZHeight = 2;
export const THeight = 2;

# project-ted-nft
A simple NFT project between a father and daughter

## Background

I have a small startup and have various projects to learn and apply blockchain technology. This project is an NFT art collection in collaboration with my daughter, a talented young artist.

We are starting simple. She provides a basic set of image sets, and I do the rest.

This project is intended to be the first of many to showcase her artwork and demonstrate our abilities.

## How it works

Creating the _Project Ted_ NFT collection has two parts:

1. Creating the unique artwork
2. Creating the blockchain smart contract

### Creating the unique artwork

The images are PNG files stores in the `img/parts` directory.

Teds consist of a _background_, _legs_, _body_, _head_, and _face_.

Each Ted has a unique number 5 digits long, each digit ranging from 1 to 5.

Each value indicates which part variation the Ted has, whether _blue_, _green_, _red_, _teal_, or _yellow_.

For example, Ted 11111 is all blue, and Ted 22222 is all green, Ted 11222 is part blue and part green, and so on.

The collection generation is generated with a small `python` script using the Pillow image library. A single loop iterates from Ted 11111 to Ted 55555, skipping any number with a digit greater than 5, combining the respective par images, and outputs the unique Ted into the `img/collection` directory.

Please see [generate_collection.py](generate_collection.py) for more information on the algorithm.

#### Rareness

Total NFTs: 3125 (5 parts ^ 5 variants )

| Type | # in collection | Examples | Percentage |
| --- | --- | --- | --- |
| Original Variations | 5 | 11111, 22222, 33333 | 0.16% |
| Single Part Difference | 100 | 11112, 22225, 44144 | 3.2% |

### Creating the blockchain smart contract
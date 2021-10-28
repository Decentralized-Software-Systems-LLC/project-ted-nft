from PIL import Image
import json
import concurrent.futures

# Start with digits for number of image sets
# e.g. 11 = 2 image sets, 111 = 3 image sets
start_id = 11111

# Define number of images/variations per set
num_parts = 5

# Determine maximum ID of a combination
# used to bound the loop
max_id = start_id * num_parts

# Counter
counter = start_id

# Array of parts
parts_groups = ["blue", "green", "red", "teal", "yellow"]

# List of combinations
combos = []

# Max workers
max_workers=7

def make_ted(combo):
    # Quick breakdown of the ID into parts and color
    img_id = str(combo)
    bg_color = int(img_id[0]) - 1
    legs_color = int(img_id[1]) - 1
    body_color = int(img_id[2]) - 1
    head_color = int(img_id[3]) - 1
    face_color = int(img_id[4]) - 1

    # Load respective images
    background = Image.open("img/parts/" + parts_groups[bg_color]  + "/bg.PNG")
    legs = Image.open("img/parts/" + parts_groups[legs_color] + "/legs.PNG")
    body = Image.open("img/parts/" + parts_groups[body_color] + "/body.PNG")
    head = Image.open("img/parts/" + parts_groups[head_color] + "/head.PNG")
    face = Image.open("img/parts/" + parts_groups[face_color] + "/face.PNG")

    # Paste images over each other
    background.alpha_composite(legs) 
    background.alpha_composite(body) 
    background.alpha_composite(head) 
    background.alpha_composite(face)

    # Output the image
    background = background.convert('RGB')
    background.save("img/collection/" + img_id + ".jpg", "JPEG", optimize=True, quality=75)

    # Output the metadata
    metadata = {
        "name": "Ted " + img_id,
        "description": "A Ted from the Project Ted collection",
        "image": "ipfs://QmQU2ny4seZNoPdTo3aWEfrrqQ7aP2aNEnp83xqFDcoGYZ/" + img_id + ".jpg",
        "attributes": [
            {
                "trait_type": "Background",
                "value": parts_groups[bg_color]
            },
            {
                "trait_type": "Legs",
                "value": parts_groups[legs_color]
            },
            {
                "trait_type": "Body",
                "value": parts_groups[body_color]
            },
            {
                "trait_type": "Head",
                "value": parts_groups[head_color]
            },
            {
                "trait_type": "Face",
                "value": parts_groups[face_color]
            }
        ]
    }
    with open("img/metadata/" + img_id + ".json", "w") as write_file:
        json.dump(metadata, write_file)

# Loop
while counter <= max_id:

    # Add combo to the list
    combos.append(counter)

    # Skip 6-0 for ones position
    if counter % 10 == 5:
        counter += 6
    else:
        counter += 1
    
    # Skip 6-0 for tens position
    if counter % 100 > 55:
        counter += 50
    
    # Skip 6-0 for hundreds position
    if counter % 1000 > 555:
        counter += 500

    # Skip 6-0 for thousands position
    if counter % 10000 > 5555:
        counter += 5000


# Distribute output to the thread pool
with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        executor.map(make_ted, combos)

    
    
    
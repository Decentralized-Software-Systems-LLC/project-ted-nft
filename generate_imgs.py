from PIL import Image

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
parts_groups = ["red", "blue", "green", "yellow", "teal"]

# Loop
while counter <= max_id:

    # print(counter)
    img_id = str(counter)
    bg_color = int(img_id[0]) - 1
    legs_color = int(img_id[1]) - 1
    body_color = int(img_id[2]) - 1
    head_color = int(img_id[3]) - 1
    face_color = int(img_id[4]) - 1


    background = Image.open("img/parts/" + parts_groups[bg_color] + "/bg.PNG")
    legs = Image.open("img/parts/" + parts_groups[legs_color] + "/legs.PNG")
    body = Image.open("img/parts/" + parts_groups[body_color] + "/body.PNG")
    head = Image.open("img/parts/" + parts_groups[head_color] + "/head.PNG")
    face = Image.open("img/parts/" + parts_groups[face_color] + "/face.PNG")

    background.paste(legs, (0, 0), legs) 
    background.paste(body, (0, 0), body) 
    background.paste(head, (0, 0), head) 
    background.paste(face, (0, 0), face)

    background.save("img/collection/" + img_id + ".png", "PNG")

    if counter % 10 == 5:
        counter += 6
    else:
        counter += 1
    
    if counter % 100 > 55:
        counter += 50
    
    if counter % 1000 > 555:
        counter += 500

    if counter % 10000 > 5555:
        counter += 5000
    
    # break


    

    
    
    
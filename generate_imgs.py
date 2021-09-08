# Start with digits for number of image sets
# e.g. 11 = 2 image sets, 111 = 3 image sets
start_id = 1111

# Define number of images/variations per set
num_parts = 5

# Determine maximum ID of a combination
# used to bound the loop
max_id = start_id * num_parts

# Counter
counter = start_id

# Loop
while counter <= max_id:

    print(counter)

    if counter % 10 == 5:
        counter += 6
    else:
        counter += 1
    
    if counter % 100 > 55:
        counter += 50
    
    if counter % 1000 > 555:
        counter += 500


    

    
    
    
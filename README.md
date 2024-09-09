# COMMENTARY

## Findings:

This was my first time working with color spaces, which I found quite challenging to work with. I didn't know all the math that was behind implementing color space transformations, along with how many schemes or "spaces" were there.

## Approach:

I found that an Object Oriented Programming approach would suit this project pretty well, as I would need shared properties for every widget (inheritance) and would therefore allow me to reuse code blocks. The, for every filter I could create a reusable function too. Along with this organization, I decided to separate the code into different files, storing related code blocks together.

## Problems found:

The first problem was getting my head around the organization of pixels inside an image object. The logic behind the iteration over every set of RGB(a) pixels needed to be refactored several times.

Another issue I had was developing the pixelated filter. What I found complicated about it was mapping the averaged pixels back to a full-size image. After some testing, I found a clever approach: I could save every pixel's index at the moment of reading the values from the original image. This way, I could just copy the averaged values over the stored indices, which in turn solved my problem.

## About the project's success

I think I did manage to do every task at least to a good degree. I would have liked to have spent more time developing this project, but as it wasn't possible, I'm happy with the result.

## About the extension

I thought that I couldn't finish this project without further testing the capabilities of the ml5js library, and 3 factors made me decide to implement a live face filter:

-   The reduced size of the image would allow me to implement real-time filtering.
-   The faceMesh API is well enough documented for me to learn to use it in a short time.
-   Every filter and widget processed and displayed, respectively, only static images, so this one needed to be different.

I thought that would be interesting to replace different parts of my face to build a dynamic new face, so I chose the Japanese Daruma as a model. I managed to replace my whole face, eyes, nose, and mouth independently while allowing the real-time positioning of every element to follow my face.

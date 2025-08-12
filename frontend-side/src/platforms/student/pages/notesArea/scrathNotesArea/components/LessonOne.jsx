import React from "react";
import { Link } from "react-router-dom";
import "./LessonOne.css";
import websiteImage from "../../../../../../../src/assets/simpleWebsite.jpg";

function LessonOne() {
  return (
    <>
      <main class="notes-container ">
        <article class="notes-content">
          <section id="intro" class="note-section">
            <h2>Let's Begin!</h2>
            <p>
              Scratch is a fun computer program that lets you make stories,
              games, and animations using blocks.
            </p>

            <div class="concept-image">
              <img src={websiteImage} alt="Magic wand illustration" />
              <p class="image-caption">
                Just like a magic wand needs special words, functions need
                special code!
              </p>
            </div>

            <div class="key-point">
              <h4> Scratch Basic Screen</h4>
              <ul>
                <div class="">
                    <h5>Stage</h5>
                    <p class="image-caption">
                    Where your story or  game happens
                  </p>
                  <img src={websiteImage} alt="Magic wand illustration" />
                  
                </div>
                 <div class="">
                    <h5>Sprite</h5>
                    <p class="image-caption">
                   The characters or things that move and talk
                  </p>
                  <img src={websiteImage} alt="Magic wand illustration" />
                  
                </div>
                <div class="">
                    <h5>Backdrop</h5>
                    <p class="image-caption">
                   The background of the stage or the playing ground of you sprite
                  </p>
                  <img src={websiteImage} alt="Magic wand illustration" />
                  
                </div>

                 <div class="">
                    <h5>Block Area</h5>
                    <p class="image-caption">
                  Colorful coding blocks for actions, this blocks help your to command the sprite to anythin you want
                  </p>
                  <img src={websiteImage} alt="Magic wand illustration" />
                  
                </div>
                 <div class="">
                    <h5>Script Area</h5>
                    <p class="image-caption">
                   Where you put blocks together to command  the sprite
                  </p>
                  <img src={websiteImage} alt="Magic wand illustration" />
                  
                </div>
              </ul>
            </div>
            <Link to="/webcodingpage" class="back-btn">
              <i class="fas fa-arrow-left"></i> Go To Practice
            </Link>
          </section>
        </article>
      </main>
    </>
  );
}
export default LessonOne;

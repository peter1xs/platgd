import React from 'react'
import '../stylesFolder/WebTopics.css'
import { Link } from 'react-router-dom'
import websiteImage from '../assets/simpleWebsite.jpg'
function WebTopics() {
    return (
        <>
           
            <main class="notes-container ">
                <article class="notes-content">
                    <section id="intro" class="note-section">
                       
                        <h2>Let's Begin!</h2>
                        <p>By the end of this level the students should be able to create simple structured websites.</p>

                        <div class="concept-image">
                            <img src={websiteImage} alt="Magic wand illustration"/>
                                <p class="image-caption">Just like a magic wand needs special words, functions need special code!</p>
                        </div>

                        <div class="key-point">
                            <h4>Html Elements?</h4>
                            <ul>
                                <li>They're like your favorite toy - you can use them again and again!</li>
                                <li>They help keep your code neat and tidy</li>
                                <li>They make fixing mistakes easier</li>
                                <li>You can share them with friends!</li>
                            </ul>
                        </div>
                       
                    </section>

                  


                </article>
            </main>




        </>
    )
}

export default WebTopics
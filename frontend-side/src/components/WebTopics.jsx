import React from 'react'
import '../stylesFolder/WebTopics.css'
import { Link } from 'react-router-dom'
import websiteImage from '../assets/simpleWebsite.jpg'
function WebTopics() {
    return (
        <>
            <header class="notes-header sticky-header">
                <div class="notes-header-container">
                    <Link to="/studentdashboard" class="back-btn"><i class="fas fa-arrow-left"></i> Back to Dashboard</Link>
                    <h1>Html Mark-Up Language for the Web!</h1>
                    
                </div>
                
            </header>

            <main class="notes-container ">
                <aside class="notes-sidebar">
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <div class="sidebar-section">
                        <h3>Explore!</h3>
                        <ul class="contents-list">
                            <li><a href="#intro" class="active">Let's Begin!</a></li>
                            <li><a href="#syntax">Headings</a></li>
                            <li><a href="#parameters">Paragraph</a></li>
                            <li><a href="#return">Images</a></li>
                            <li><a href="#examples">List</a></li>
                            <li><a href="#examples">Videos</a></li>
                            <li><a href="#examples">Forms & Inputs</a></li>
                            <li><a href="#examples"></a></li>
                            <li><a href="#examples"></a></li>
                        </ul>
                    </div>

                </aside>

                <article class="notes-content">
                    <section id="intro" class="note-section">
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
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
                         <Link to="/webcodingpage" class="back-btn"><i class="fas fa-arrow-left"></i> Go To Practice</Link>
                    </section>

                    <section id="syntax" class="note-section">
                         <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <h2>Headings</h2>
                        <p>Here's how we write a simple function spell:</p>

                        
                        <div class="code-explanation">
                            <h4>What's Happening Here?</h4>
                            <ol>
                                <li><strong>def</strong> - Our magic word to start a function</li>
                                <li><strong>make_pizza</strong> - The name of our spell</li>
                                <li><strong>()</strong> - Where we put special ingredients</li>
                                <li><strong>:</strong> - Says "get ready for the magic!"</li>
                                <li>The indented code is what our spell does</li>
                            </ol>
                        </div>
                    </section>

                    <section id="parameters" class="note-section">
                        <h2>Secret Ingredients</h2>
                        <p>We can make our functions more powerful with special ingredients called parameters:</p>

                        <div class="code-comparison">
                            <div class="code-example">
                                <h4>Making the Spell</h4>
                                
                            </div>
                            <div class="code-example">
                                <h4>Using the Spell</h4>
                                
                            </div>
                        </div>

                        <div class="concept-image">
                            <img src="https://via.placeholder.com/800x300.png?text=Different+flavors+going+into+an+ice+cream+machine" alt="Ice cream machine"/>
                                <p class="image-caption">Just like an ice cream machine needs flavors, functions can take inputs!</p>
                        </div>
                    </section>

                    <section id="return" class="note-section">
                        <h2>Treasure Chest</h2>
                        <p>Functions can give us back treasures using <code>return</code>:</p>

                       
                        <div class="interactive-demo">
                            <h4>Your Turn to Try!</h4>
                            <div class="demo-container">
                                <div class="code-editor">
                                    <div class="editor-header">Magic Code Playground</div>
                                    <textarea class="editor-body" placeholder="def double_fun(num):\n    # Make this function return double the number!\n    return num * 2\n\nresult = double_fun(5)\nprint(result)"></textarea>
                                    <button class="run-btn">Cast the Spell! ✨</button>
                                </div>
                                <div class="output-panel">
                                    <div class="output-header">Magic Happens Here!</div>
                                    <div class="output-body"></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="examples" class="note-section">
                        <h2>Fun Examples</h2>

                        <div class="example-grid">
                            <div class="example-card">
                                <h4>1. Rainbow Maker</h4>
                                
                            </div>

                            <div class="example-card">
                                <h4>2. Robot Dance</h4>
                               
                            </div>

                            <div class="example-card">
                                <h4>3. Superhero Power</h4>
                                
                            </div>
                        </div>
                    </section>
                </article>
            </main>




        </>
    )
}

export default WebTopics
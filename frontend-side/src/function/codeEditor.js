
        document.addEventListener('DOMContentLoaded', function() {
            const matrix = document.getElementById('matrix');
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            // Matrix Rain Effect (Vertical Falling Characters)
            function createMatrixRain() {
                const col = document.createElement('div');
                col.className = 'matrix-rain';
                col.style.left = `${Math.random() * width}px`;
                matrix.appendChild(col);
                
                let text = '';
                const chars = "01アイウエオABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*";
                
                const addChar = () => {
                    text += chars[Math.floor(Math.random() * chars.length)] + '\n';
                    col.textContent = text;
                    // Limit length and fade out older characters
                    if (text.length > 30) {
                        text = text.substring(1);
                        col.style.opacity = `${0.3 - (text.length / 150)}`; // Adjusted fade calculation
                    }
                };
                
                const rainInterval = setInterval(addChar, 100);
                
                // Remove column after random time (10-30 seconds)
                setTimeout(() => {
                    clearInterval(rainInterval);
                    col.remove();
                }, 10000 + Math.random() * 20000);
            }
            
            // Start multiple rain columns (reduced from 50 to 30)
            for (let i = 0; i < 30; i++) {
                setTimeout(createMatrixRain, i * 400); // Slower initial creation
            }
            
            // Add new columns less frequently
            setInterval(createMatrixRain, 3000); // Reduced from 2000 to 3000
            
            // Adjust on window resize
            window.addEventListener('resize', function() {
                const columns = document.querySelectorAll('.matrix-rain');
                columns.forEach(col => {
                    col.style.left = `${Math.random() * width}px`;
                });
            });
        });
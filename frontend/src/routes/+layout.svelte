<script module>
    import "../app.css";
</script>

<div class="min-h-screen bg-gray-900 text-gray-100 flex flex-col min-h-[calc(100vh-12rem)] flex flex-co">
    <!-- Navigation -->
    <nav class="bg-gray-800 shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center">
                    <a href="/" class="flex-shrink-0">
            <span class="text-purple-500 font-bold text-xl hover:text-purple-300 transition duration-300">
              Stop Game
            </span>
                    </a>
                    <div class="hidden md:flex ml-10 space-x-4">
                        <a
                                href="#"
                                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                        >
                            About
                        </a>
                        <a
                                href="#"
                                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                        >
                            Contact
                        </a>
                    </div>
                </div>
                <!-- Mobile Menu Button (Optional) -->
                <div class="md:hidden">
                    <button
                            type="button"
                            class="text-gray-300 hover:text-white focus:outline-none"
                            onclick="{toggleMobileMenu}"
                    >
                        <svg
                                class="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                        >
                            <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        <!-- Mobile Menu (Hidden by default) -->
        <div id="mobileMenu" class="md:hidden hidden">
            <div class="px-2 pt-2 pb-3 space-y-1">
                <a
                        href="#"
                        class="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                >
                    About
                </a>
                <a
                        href="#"
                        class="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                >
                    Contact
                </a>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 bg-gray-900 text-gray-100 flex flex-col justify-center items-center p-4">
        <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-gray-400 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Company Info -->
                <div>
                    <h3 class="text-lg font-semibold text-white mb-4">Stop Game</h3>
                    <p class="text-sm">
                        Innovative gaming platform dedicated to creating immersive experiences.
                    </p>
                </div>

                <!-- Quick Links -->
                <div>
                    <h4 class="text-md font-semibold text-white mb-4">Quick Links</h4>
                    <nav class="space-y-2">
                        <a href="#" class="block text-gray-400 hover:text-white transition duration-300">Home</a>
                        <a href="#" class="block text-gray-400 hover:text-white transition duration-300">About</a>
                        <a href="#" class="block text-gray-400 hover:text-white transition duration-300">Contact</a>
                    </nav>
                </div>

                <!-- Legal -->
                <div>
                    <h4 class="text-md font-semibold text-white mb-4">Legal</h4>
                    <nav class="space-y-2">
                        <a href="#" class="block text-gray-400 hover:text-white transition duration-300">Privacy Policy</a>
                        <a href="#" class="block text-gray-400 hover:text-white transition duration-300">Terms of Service</a>
                    </nav>
                </div>
            </div>

            <!-- Copyright -->
            <div class="mt-8 pt-8 border-t border-gray-700 text-center">
                <p class="text-sm">
                    © {new Date().getFullYear()} Stop Game. All rights reserved.
                </p>
            </div>
        </div>
    </footer>
</div>

<script lang="ts">
    // Toggle mobile menu visibility
    function toggleMobileMenu() {
        const mobileMenu = document.getElementById("mobileMenu");
        if (mobileMenu) {
            mobileMenu.classList.toggle("hidden");
        }

    }
</script>
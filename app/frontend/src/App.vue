<script setup>
import { ref, onMounted } from 'vue';

const selectedProject = ref(null);
const isMenuOpen = ref(false);
const cursorPosition = ref({ x: 0, y: 0 });
const isHoveringInteractive = ref(false);

const projects = ref([
    {
        id: 1,
        title: "E-Commerce Dashboard",
        category: "Web App",
        shortDesc: "Modern dashboard for managing online store products, orders, and analytics.",
        description: "A comprehensive dashboard for e-commerce businesses to manage their products, track orders, analyze sales metrics, and gain insights about customer behavior. Built with Vue.js and Tailwind CSS, this application features real-time updates, responsive design, and interactive charts.",
        date: "Apr 2025",
        client: "ShopifyPlus",
        role: "Lead Developer",
        image: "https://picsum.photos/800/600",
        tech: ["Vue.js", "Tailwind CSS", "Vuex", "Chart.js", "Firebase"],
        liveLink: "#",
        repoLink: "#",
        process: [
            {
                title: "Research & Planning",
                description: "Conducted user research to understand pain points of e-commerce managers and planned features accordingly."
            },
            {
                title: "Design & Prototyping",
                description: "Created wireframes and interactive prototypes to test user flow and gather feedback."
            },
            {
                title: "Development",
                description: "Implemented the dashboard using Vue.js with component-based architecture for scalability."
            },
            {
                title: "Testing & Deployment",
                description: "Conducted extensive testing and optimized performance before deploying to production."
            }
        ],
        challenges: [
            "Handling real-time data updates without impacting performance",
            "Creating intuitive interfaces for complex data visualization",
            "Ensuring mobile responsiveness for all dashboard components"
        ],
        solutions: [
            "Implemented efficient state management with Vuex and lazy loading",
            "Designed modular chart components with customizable parameters",
            "Used Tailwind CSS grid system with custom breakpoints for responsive layouts"
        ]
    },
    {
        id: 2,
        title: "Travel Blog Platform",
        category: "Website",
        shortDesc: "Interactive travel blog with dynamic maps and content management.",
        description: "A feature-rich travel blog platform allowing users to share their journeys with interactive maps, photo galleries, and detailed travel guides. The platform includes a custom CMS for easy content management.",
        date: "Feb 2025",
        client: "Wanderlust Media",
        role: "Frontend Developer",
        image: "https://picsum.photos/800/600",
        tech: ["Vue.js", "Tailwind CSS", "Leaflet.js", "Strapi CMS"],
        liveLink: "#",
        repoLink: "#",
        process: [
            {
                title: "Concept Development",
                description: "Worked with travel bloggers to identify key features and content presentation needs."
            },
            {
                title: "UX/UI Design",
                description: "Created detailed wireframes and visual designs focused on showcasing travel photography."
            },
            {
                title: "Frontend Development",
                description: "Built the frontend using Vue.js with optimized image loading and map integrations."
            },
            {
                title: "CMS Integration",
                description: "Integrated Strapi CMS with custom content types for blog posts and travel guides."
            }
        ],
        challenges: [
            "Optimizing image loading for users with limited bandwidth",
            "Creating interactive maps that work across devices",
            "Designing an intuitive authoring experience"
        ],
        solutions: [
            "Implemented lazy loading and responsive images with multiple breakpoints",
            "Used Leaflet.js with custom controls for touch and mouse interactions",
            "Created a WYSIWYG editor with custom components for travel content"
        ]
    },
    {
        id: 3,
        title: "Fitness Tracking App",
        category: "Mobile App",
        shortDesc: "Progressive web app for tracking workouts and nutrition goals.",
        description: "A comprehensive fitness tracking PWA that helps users monitor workouts, track nutrition, and achieve fitness goals. Features include workout planning, progress visualization, and social challenges.",
        date: "Jan 2025",
        client: "FitLife",
        role: "Full Stack Developer",
        image: "https://picsum.photos/800/600",
        tech: ["Vue.js", "Tailwind CSS", "Pinia", "Node.js", "MongoDB"],
        liveLink: "#",
        repoLink: "#",
        process: [
            {
                title: "Market Research",
                description: "Analyzed existing fitness apps to identify opportunities for improvement."
            },
            {
                title: "User Journey Mapping",
                description: "Created detailed user journeys for different fitness goals and experience levels."
            },
            {
                title: "MVP Development",
                description: "Developed core tracking features and tested with a small group of fitness enthusiasts."
            },
            {
                title: "Expansion & Refinement",
                description: "Added social features and refined UX based on initial user feedback."
            }
        ],
        challenges: [
            "Creating intuitive workout logging interfaces",
            "Ensuring offline functionality for gym usage",
            "Developing meaningful progress visualizations"
        ],
        solutions: [
            "Designed a drag-and-drop workout builder with exercise library",
            "Implemented service workers for offline data storage and sync",
            "Created custom chart components with animation for progress tracking"
        ]
    },
    {
        id: 4,
        title: "AI Content Assistant",
        category: "SaaS",
        shortDesc: "AI-powered web tool for content creators, writers, and marketers.",
        description: "An AI-powered content creation platform that helps writers, marketers, and content creators generate ideas, improve their writing, and optimize content for different channels and audiences.",
        date: "Mar 2025",
        client: "ContentLab",
        role: "Frontend Lead",
        image: "https://picsum.photos/800/600",
        tech: ["Vue.js", "Tailwind CSS", "TypeScript", "OpenAI API", "Express.js"],
        liveLink: "#",
        repoLink: "#",
        process: [
            {
                title: "AI Integration Planning",
                description: "Researched and planned integration with language models for various content generation tasks."
            },
            {
                title: "UX Design for AI Tools",
                description: "Designed intuitive interfaces for complex AI interactions and content editing."
            },
            {
                title: "Frontend Implementation",
                description: "Built the application with Vue.js using TypeScript for type safety and scalability."
            },
            {
                title: "Testing & Optimization",
                description: "Conducted extensive usability testing and optimized AI response handling."
            }
        ],
        challenges: [
            "Creating intuitive interfaces for complex AI interactions",
            "Managing asynchronous AI requests with good UX",
            "Ensuring content quality and relevance across different use cases"
        ],
        solutions: [
            "Designed a conversational UI with clear context controls",
            "Implemented optimistic UI updates with loading states and fallbacks",
            "Created content quality scoring system with improvement suggestions"
        ]
    },
    {
        id: 5,
        title: "NFT Marketplace",
        category: "Web3",
        shortDesc: "Blockchain-based platform for digital artists to mint and sell NFTs.",
        description: "A modern NFT marketplace that allows digital artists to mint, showcase, and sell their artwork as non-fungible tokens. The platform features a gallery-like experience with artist profiles, collections, and auction functionality.",
        date: "Dec 2024",
        client: "CryptoArts",
        role: "Frontend Developer",
        image: "https://picsum.photos/800/600",
        tech: ["Vue.js", "Tailwind CSS", "Ethers.js", "IPFS", "Web3 Auth"],
        liveLink: "#",
        repoLink: "#",
        process: [
            {
                title: "Blockchain Research",
                description: "Researched NFT standards and marketplace mechanics to design the platform architecture."
            },
            {
                title: "UX/UI Design",
                description: "Created a gallery-inspired interface focusing on artwork presentation and discovery."
            },
            {
                title: "Smart Contract Integration",
                description: "Implemented frontend integration with ERC-721 and ERC-1155 smart contracts."
            },
            {
                title: "Testing & Security",
                description: "Conducted thorough testing and security audits of Web3 interactions."
            }
        ],
        challenges: [
            "Creating a seamless Web3 onboarding experience",
            "Optimizing for network latency and transaction confirmation",
            "Designing intuitive interfaces for blockchain concepts"
        ],
        solutions: [
            "Implemented multi-wallet support with simplified onboarding flows",
            "Created optimistic UI updates with transaction monitoring",
            "Developed visual explainers and tooltips for complex concepts"
        ]
    }
]);

// Track cursor position for interactive effects
const updateCursorPosition = (e) => {
    cursorPosition.value = { x: e.clientX, y: e.clientY };
};

// Method to select and show project details
const selectProject = (project) => {
    selectedProject.value = project;
    isMenuOpen.value = false;
    setTimeout(() => {
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    }, 100);
};

// Add scroll animation
onMounted(() => {
    window.addEventListener('mousemove', updateCursorPosition);

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
});
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-white p-4 md:p-8 overflow-x-hidden">
        <!-- Custom cursor for interactive elements -->
        <div class="fixed z-50 w-8 h-8 rounded-full bg-indigo-500/20 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
            :style="{
                left: `${cursorPosition.x}px`,
                top: `${cursorPosition.y}px`,
                transform: `translate(-50%, -50%) scale(${isHoveringInteractive ? 2 : 1})`,
                opacity: isHoveringInteractive ? 1 : 0,
                transition: 'transform 0.3s ease, opacity 0.2s ease'
            }"></div>

        <!-- Animated background elements -->
        <div class="fixed inset-0 overflow-hidden pointer-events-none">
            <div class="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10"></div>
            <div class="absolute top-0 left-0 w-full h-full bg-radial-gradient opacity-30"></div>
        </div>

        <!-- Floating particles -->
        <div class="particles-container fixed inset-0 pointer-events-none overflow-hidden">
            <div v-for="i in 15" :key="i" class="particle" :style="{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 8 + 2}px`,
                height: `${Math.random() * 8 + 2}px`,
                animationDelay: `${Math.random() * 5}s`
            }"></div>
        </div>

        <!-- Navbar -->
        <nav class="flex justify-between items-center mb-8 md:mb-16 relative z-10">
            <div class="text-2xl font-bold">
                <span class="text-indigo-400">tech</span>Tahirou
            </div>
            <div class="hidden md:flex space-x-8">
                <a href="#" class="hover:text-indigo-400 transition-colors relative group">
                    Accueil
                    <span
                        class="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a href="#projects" class="hover:text-indigo-400 transition-colors relative group">
                    Projets
                    <span
                        class="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a href="#about" class="hover:text-indigo-400 transition-colors relative group">
                    À propos
                    <span
                        class="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a href="#contact" class="hover:text-indigo-400 transition-colors relative group">
                    Contact
                    <span
                        class="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
                </a>
            </div>
            <button class="md:hidden z-50" @click="isMenuOpen = !isMenuOpen">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            <!-- Mobile menu -->
            <div v-if="isMenuOpen"
                class="fixed inset-0 bg-gray-900/95 backdrop-blur-md z-40 flex flex-col items-center justify-center space-y-8 text-2xl">
                <button @click="isMenuOpen = false" class="absolute top-8 right-8">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <a @click="isMenuOpen = false" href="#" class="hover:text-indigo-400 transition-colors">Accueil</a>
                <a @click="isMenuOpen = false" href="#projects"
                    class="hover:text-indigo-400 transition-colors">Projects</a>
                <a @click="isMenuOpen = false" href="#about" class="hover:text-indigo-400 transition-colors">About</a>
                <a @click="isMenuOpen = false" href="#contact"
                    class="hover:text-indigo-400 transition-colors">Contact</a>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="mb-16 md:mb-24 relative z-10">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-on-scroll">
                <div class="space-y-6">
                    <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                        <span
                            class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">Développeur</span>
                        <br>Logiciel Web/Mobile
                    </h1>
                    <p class="text-gray-400 text-lg md:text-xl max-w-2xl">
                        Je conçois des expériences numériques de pointe qui allient une esthétique époustouflante à une
                        fonctionnalité sans faille.
                        Je transforme des défis complexes en solutions intuitives.
                    </p>
                    <div class="flex flex-wrap gap-4">
                        <button @mouseenter="isHoveringInteractive = true" @mouseleave="isHoveringInteractive = false"
                            class="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-8 py-4 rounded-xl transition-all group hover:shadow-xl hover:shadow-indigo-500/20">
                            <span class="relative z-10 flex items-center">
                                Explorer mes projets
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </span>
                            <span
                                class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        </button>
                        <button @mouseenter="isHoveringInteractive = true" @mouseleave="isHoveringInteractive = false"
                            class="relative overflow-hidden border-2 border-indigo-600 text-indigo-400 px-8 py-4 rounded-xl transition-all group hover:bg-indigo-600 hover:text-white">
                            <span class="relative z-10 flex items-center">
                                Contactez-moi
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </span>
                            <span
                                class="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity"></span>
                        </button>
                    </div>

                    <div class="flex flex-wrap gap-6 pt-4">
                        <div class="flex items-center">
                            <div class="w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                            <span class="text-sm text-gray-400">
                                <span class="font-semibold">Statut:</span> En recherche d'une alternance pour l'année
                                2025
                            </span>
                        </div>
                    </div>
                </div>
                <div class="relative">

                    <div
                        class="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-r from-indigo-600/20 to-pink-600/20 blur-xl">
                    </div>
                    <div
                        class="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-xl">
                    </div>

                    <!-- Carte principale -->
                    <div
                        class="relative z-10 bg-gray-900/50 backdrop-blur-lg rounded-3xl border border-gray-700/50 overflow-hidden shadow-2xl shadow-indigo-500/10 transform transition-all duration-500 hover:shadow-indigo-500/20">
                        <!-- Effet de vague animé en haut -->
                        <div
                            class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-500 animate-wave">
                        </div>

                        <!-- Contenu -->
                        <div class="p-8 md:p-10">
                            <!-- Avatar et badge -->
                            <div class="flex flex-col items-center mb-6">
                                <div class="relative">
                                    <div
                                        class="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-indigo-600 to-pink-600 p-1">
                                        <img src="https://media.licdn.com/dms/image/v2/D4D03AQHIE7qoqaOsog/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1698388486632?e=1751500800&v=beta&t=CldoQXizZF3-xRdGS7A45tPY_Np6fLaI3AtrKcs4wqQ"
                                            class="w-full h-full rounded-full object-cover border-2 border-gray-800/50">
                                    </div>
                                    <div
                                        class="absolute -bottom-2 -right-2 bg-gray-900 rounded-full p-2 border-2 border-gray-800/50">
                                        <div
                                            class="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-cyan-500 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white"
                                                viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Statut professionnel -->
                            <div class="text-center mb-8">
                                <h3 class="text-xl md:text-2xl font-bold mb-2">
                                    Tahirou Laouan M.
                                </h3>
                                <div
                                    class="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50 mb-4">
                                    <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></span>
                                    <span class="text-sm font-medium">En poste chez <span class="text-indigo-400">Shin
                                            Agency SAS</span></span>
                                </div>
                                <p class="text-gray-400 max-w-md mx-auto">Développeur Fullstack spécialisé en Vue.js et
                                    Node.js, créant des expériences digitales innovantes depuis 5 ans.</p>
                            </div>

                            <!-- Statistiques -->
                            <div class="grid grid-cols-3 gap-4 mb-8">
                                <div class="text-center">
                                    <div class="text-2xl md:text-3xl font-bold text-indigo-400 mb-1">3+</div>
                                    <div class="text-xs text-gray-400 uppercase tracking-wider">Années XP</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl md:text-3xl font-bold text-pink-400 mb-1">24</div>
                                    <div class="text-xs text-gray-400 uppercase tracking-wider">Projets</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl md:text-3xl font-bold text-purple-400 mb-1">100%</div>
                                    <div class="text-xs text-gray-400 uppercase tracking-wider">Satisfaction</div>
                                </div>
                            </div>

                            <!-- Bouton CV -->
                            <div class="text-center">
                                <button
                                    class="relative cursor-pointer overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-6 py-3 rounded-lg group transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20">
                                    <span class="relative z-10 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Consulter mon CV
                                    </span>
                                    <span
                                        class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                </button>
                            </div>
                        </div>

                        <!-- Effet de particules -->
                        <div class="absolute inset-0 overflow-hidden pointer-events-none">
                            <div
                                class="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-indigo-500/30 animate-float-1">
                            </div>
                            <div class="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-pink-500/30 animate-float-2">
                            </div>
                            <div
                                class="absolute bottom-1/4 right-1/3 w-2 h-2 rounded-full bg-purple-500/30 animate-float-3">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Projects Bento Grid -->
        <section id="projects" class="mb-16 md:mb-24 relative z-10">
            <div class="animate-on-scroll">
                <div class="flex justify-between items-center mb-8 md:mb-12">
                    <h2 class="text-3xl md:text-4xl font-bold">
                        <span
                            class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">Selected</span>
                        Works
                    </h2>
                    <div class="flex items-center">
                        <span class="text-indigo-400 mr-2 hidden md:block">Explore all</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-400" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                </div>

                <div v-if="!selectedProject">
                    <!-- Enhanced Bento Grid Layout -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <!-- Feature Project 1 -->
                        <div @click="selectProject(projects[0])" @mouseenter="isHoveringInteractive = true"
                            @mouseleave="isHoveringInteractive = false"
                            class="col-span-1 md:col-span-2 row-span-2 bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 hover:bg-gray-700/50 cursor-pointer transition-all transform hover:scale-[1.01] group border border-gray-700/50 hover:border-indigo-500/30 relative overflow-hidden">
                            <div
                                class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            </div>
                            <div
                                class="relative h-64 md:h-96 mb-4 overflow-hidden rounded-2xl border border-gray-700/50">
                                <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10">
                                </div>
                                <div class="absolute bottom-4 left-4 right-4 z-20">
                                    <div class="flex items-center justify-between">
                                        <span
                                            class="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-xs px-3 py-1 rounded-full">{{
                                                projects[0].category }}</span>
                                        <span class="text-white/80 text-sm">{{ projects[0].date }}</span>
                                    </div>
                                    <h3
                                        class="text-xl md:text-2xl lg:text-3xl font-bold text-white mt-2 group-hover:text-indigo-400 transition-colors">
                                        {{ projects[0].title }}</h3>
                                </div>
                                <div
                                    class="w-full h-full bg-gradient-to-br from-indigo-900/30 to-gray-800 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-indigo-500/30"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            <p class="text-gray-400 relative z-10">{{ projects[0].shortDesc }}</p>
                            <div class="mt-4 flex flex-wrap gap-2 relative z-10">
                                <span v-for="(tech, i) in projects[0].tech" :key="i"
                                    class="bg-gray-700/50 text-xs px-3 py-1 rounded-full border border-gray-600/50">{{
                                        tech }}</span>
                            </div>
                        </div>

                        <!-- Project 2 -->
                        <div @click="selectProject(projects[1])" @mouseenter="isHoveringInteractive = true"
                            @mouseleave="isHoveringInteractive = false"
                            class="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 hover:bg-gray-700/50 cursor-pointer transition-all transform hover:scale-[1.01] group border border-gray-700/50 hover:border-pink-500/30 relative overflow-hidden">
                            <div
                                class="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            </div>
                            <div class="relative h-40 mb-4 overflow-hidden rounded-2xl border border-gray-700/50">
                                <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10">
                                </div>
                                <div class="absolute bottom-2 left-2 z-20">
                                    <span
                                        class="bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs px-3 py-1 rounded-full">{{
                                            projects[1].category }}</span>
                                </div>
                                <div
                                    class="w-full h-full bg-gradient-to-br from-pink-900/30 to-gray-800 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-pink-500/30"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 class="text-lg font-bold relative z-10 group-hover:text-pink-400 transition-colors">{{
                                projects[1].title }}</h3>
                            <p class="text-gray-400 text-sm mt-2 relative z-10">{{ projects[1].shortDesc }}</p>
                        </div>

                        <!-- Project 3 -->
                        <div @click="selectProject(projects[2])" @mouseenter="isHoveringInteractive = true"
                            @mouseleave="isHoveringInteractive = false"
                            class="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 hover:bg-gray-700/50 cursor-pointer transition-all transform hover:scale-[1.01] group border border-gray-700/50 hover:border-green-500/30 relative overflow-hidden">
                            <div
                                class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            </div>
                            <div class="relative h-40 mb-4 overflow-hidden rounded-2xl border border-gray-700/50">
                                <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10">
                                </div>
                                <div class="absolute bottom-2 left-2 z-20">
                                    <span
                                        class="bg-gradient-to-r from-green-600 to-teal-600 text-white text-xs px-3 py-1 rounded-full">{{
                                            projects[2].category }}</span>
                                </div>
                                <div
                                    class="w-full h-full bg-gradient-to-br from-green-900/30 to-gray-800 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-500/30"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 class="text-lg font-bold relative z-10 group-hover:text-green-400 transition-colors">{{
                                projects[2].title }}</h3>
                            <p class="text-gray-400 text-sm mt-2 relative z-10">{{ projects[2].shortDesc }}</p>
                        </div>

                        <!-- Project 4 -->
                        <div @click="selectProject(projects[3])" @mouseenter="isHoveringInteractive = true"
                            @mouseleave="isHoveringInteractive = false"
                            class="col-span-1 md:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 hover:bg-gray-700/50 cursor-pointer transition-all transform hover:scale-[1.01] group border border-gray-700/50 hover:border-yellow-500/30 relative overflow-hidden">
                            <div
                                class="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            </div>
                            <div class="flex flex-col md:flex-row gap-4 relative z-10">
                                <div
                                    class="relative h-40 w-full md:w-1/2 overflow-hidden rounded-2xl border border-gray-700/50">
                                    <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10">
                                    </div>
                                    <div class="absolute bottom-2 left-2 z-20">
                                        <span
                                            class="bg-gradient-to-r from-yellow-600 to-amber-600 text-white text-xs px-3 py-1 rounded-full">{{
                                                projects[3].category }}</span>
                                    </div>
                                    <div
                                        class="w-full h-full bg-gradient-to-br from-yellow-900/30 to-gray-800 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-yellow-500/30"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="md:w-1/2">
                                    <h3 class="text-lg font-bold group-hover:text-yellow-400 transition-colors">{{
                                        projects[3].title }}</h3>
                                    <p class="text-gray-400 text-sm mt-2">{{ projects[3].shortDesc }}</p>
                                    <div class="mt-4 flex flex-wrap gap-2">
                                        <span v-for="(tech, i) in projects[3].tech.slice(0, 3)" :key="i"
                                            class="bg-gray-700/50 text-xs px-3 py-1 rounded-full border border-gray-600/50">{{
                                                tech }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Project 5 -->
                        <div @click="selectProject(projects[4])" @mouseenter="isHoveringInteractive = true"
                            @mouseleave="isHoveringInteractive = false"
                            class="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 hover:bg-gray-700/50 cursor-pointer transition-all transform hover:scale-[1.01] group border border-gray-700/50 hover:border-blue-500/30 relative overflow-hidden">
                            <div
                                class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            </div>
                            <div class="relative h-40 mb-4 overflow-hidden rounded-2xl border border-gray-700/50">
                                <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10">
                                </div>
                                <div class="absolute bottom-2 left-2 z-20">
                                    <span
                                        class="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs px-3 py-1 rounded-full">{{
                                            projects[4].category }}</span>
                                </div>
                                <div
                                    class="w-full h-full bg-gradient-to-br from-blue-900/30 to-gray-800 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-blue-500/30"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 class="text-lg font-bold relative z-10 group-hover:text-blue-400 transition-colors">{{
                                projects[4].title }}</h3>
                            <p class="text-gray-400 text-sm mt-2 relative z-10">{{ projects[4].shortDesc }}</p>
                        </div>
                    </div>
                </div>

                <!-- Project Detail View -->
                <div v-else
                    class="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 transition-all border border-gray-700/50">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl md:text-3xl font-bold">{{ selectedProject.title }}</h2>
                        <button @click="selectedProject = null" @mouseenter="isHoveringInteractive = true"
                            @mouseleave="isHoveringInteractive = false"
                            class="bg-gray-700/50 hover:bg-gray-600/50 p-2 rounded-lg transition-colors border border-gray-600/50">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div class="rounded-2xl overflow-hidden mb-6 border border-gray-700/50">
                                <div
                                    class="w-full h-64 md:h-80 bg-gradient-to-br from-indigo-900/30 to-gray-800 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-indigo-500/30"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>

                            <div class="flex flex-wrap gap-2 mb-6">
                                <span v-for="(tech, i) in selectedProject.tech" :key="i"
                                    class="bg-gray-700/50 text-xs px-3 py-1 rounded-full border border-gray-600/50">{{
                                        tech }}</span>
                            </div>

                            <div class="grid grid-cols-2 gap-4 mb-6">
                                <div class="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
                                    <h4 class="text-gray-400 text-sm">Category</h4>
                                    <p>{{ selectedProject.category }}</p>
                                </div>
                                <div class="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
                                    <h4 class="text-gray-400 text-sm">Date</h4>
                                    <p>{{ selectedProject.date }}</p>
                                </div>
                                <div class="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
                                    <h4 class="text-gray-400 text-sm">Client</h4>
                                    <p>{{ selectedProject.client }}</p>
                                </div>
                                <div class="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
                                    <h4 class="text-gray-400 text-sm">Role</h4>
                                    <p>{{ selectedProject.role }}</p>
                                </div>
                            </div>

                            <div class="flex flex-wrap gap-4">
                                <a :href="selectedProject.liveLink" target="_blank"
                                    @mouseenter="isHoveringInteractive = true"
                                    @mouseleave="isHoveringInteractive = false"
                                    class="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-6 py-3 rounded-lg transition-all group hover:shadow-lg hover:shadow-indigo-500/20">
                                    <span class="relative z-10 flex items-center">
                                        Live Preview
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </span>
                                    <span
                                        class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                </a>
                                <a :href="selectedProject.repoLink" target="_blank"
                                    @mouseenter="isHoveringInteractive = true"
                                    @mouseleave="isHoveringInteractive = false"
                                    class="relative overflow-hidden border border-indigo-600 text-indigo-400 px-6 py-3 rounded-lg transition-all group hover:bg-indigo-600 hover:text-white">
                                    <span class="relative z-10 flex items-center">
                                        View Code
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                        </svg>
                                    </span>
                                    <span
                                        class="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity"></span>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 class="text-xl font-bold mb-4">Project Overview</h3>
                            <p class="text-gray-400 mb-6">{{ selectedProject.description }}</p>

                            <h3 class="text-xl font-bold mb-4">Development Process</h3>
                            <div class="space-y-4">
                                <div v-for="(step, i) in selectedProject.process" :key="i" class="flex">
                                    <div class="mr-4 flex-shrink-0">
                                        <div
                                            class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center">
                                            {{ i + 1 }}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-lg">{{ step.title }}</h4>
                                        <p class="text-gray-400">{{ step.description }}</p>
                                    </div>
                                </div>
                            </div>

                            <h3 class="text-xl font-bold mt-6 mb-4">Challenges & Solutions</h3>
                            <div class="bg-gray-700/50 p-4 rounded-xl mb-6 border border-gray-600/50">
                                <h4 class="font-bold">Challenges</h4>
                                <ul class="list-disc list-inside text-gray-400 mt-2 space-y-1">
                                    <li v-for="(challenge, i) in selectedProject.challenges" :key="i">{{ challenge }}
                                    </li>
                                </ul>
                            </div>
                            <div class="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
                                <h4 class="font-bold">Solutions</h4>
                                <ul class="list-disc list-inside text-gray-400 mt-2 space-y-1">
                                    <li v-for="(solution, i) in selectedProject.solutions" :key="i">{{ solution }}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- About & Contact -->
        <section id="about" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 relative z-10 h-full">
            <div class="grid md:gap-0 gap-6">
                <div class="animate-on-scroll min-h-full h-full">
                <div class="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50">
                    <h2 class="text-2xl md:text-3xl font-bold mb-4">
                        <span
                            class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">Professional</span>
                        Journey
                    </h2>
                    <p class="text-gray-400 mb-4">
                        I'm a visionary developer with 5+ years of experience creating cutting-edge digital solutions.
                        My expertise spans the entire development lifecycle, from conceptualization to deployment, with
                        a strong focus on creating intuitive user experiences.
                    </p>
                    <p class="text-gray-400 mb-6">
                        My approach combines technical excellence with creative problem-solving, ensuring that every
                        project not only meets but exceeds expectations. I thrive on transforming complex challenges
                        into elegant, scalable solutions.
                    </p>
                </div>
            </div>

            <div class="animate-on-scroll min-h-full h-full">
                <div class="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50">
                    <h2 class="text-2xl md:text-3xl font-bold mb-4">
                        <span
                            class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">Compétences</span>
                            & Outils
                    </h2>
                    <div>
                        <ul class="grid md:grid-cols-5 gap-2 min-h-full h-full overflow-scroll">
                            <li class="flex items-start p-3 rounded border border-gray-700/50 bg-gray-700/50">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-400 mt-0.5 mr-2"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 13l4 4L19 7" />
                                </svg>
                                <span>
                                    JavaScript
                                </span>
                            </li>
                            <li class="flex items-start p-3 rounded border border-gray-700/50 bg-gray-700/50">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-400 mt-0.5 mr-2"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 13l4 4L19 7" />
                                </svg>
                                <span>
                                    Vue.js
                                </span>
                            </li>
                            <li class="flex items-start p-3 rounded border border-gray-700/50 bg-gray-700/50">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-400 mt-0.5 mr-2"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 13l4 4L19 7" />
                                </svg>
                                <span>
                                    React.js / React Native
                                </span>
                            </li>
                            <li class="flex items-start p-3 rounded border border-gray-700/50 bg-gray-700/50">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-400 mt-0.5 mr-2"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 13l4 4L19 7" />
                                </svg>
                                <span>
                                    Node.js / Express.js
                                </span>
                            </li>
                            <li class="flex items-start p-3 rounded border border-gray-700/50 bg-gray-700/50">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-400 mt-0.5 mr-2"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 13l4 4L19 7" />
                                </svg>
                                <span>
                                    PHP
                                </span>
                            </li>
                            <li v-for="n in 10"
                                class="flex items-start p-3 rounded border border-gray-700/50 bg-gray-700/50">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-400 mt-0.5 mr-2"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 13l4 4L19 7" />
                                </svg>
                                <span>
                                    Laravel / Symfony
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            </div>

            <div id="contact" class="animate-on-scroll min-h-full h-full">
                <div class="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50">
                    <h2 class="text-2xl md:text-3xl font-bold mb-4">
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500">Let's
                            Build</span> Something Amazing
                    </h2>
                    <p class="text-gray-400 mb-6">
                        Have a project in mind or want to discuss potential opportunities? I'm currently available for
                        freelance work and interesting collaborations.
                    </p>

                    <form class="space-y-4 mb-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-400 mb-1">Name</label>
                                <input type="text" id="name"
                                    class="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Your name">
                            </div>
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                <input type="email" id="email"
                                    class="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Your email">
                            </div>
                        </div>
                        <div>
                            <label for="subject" class="block text-sm font-medium text-gray-400 mb-1">Subject</label>
                            <input type="text" id="subject"
                                class="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Subject">
                        </div>
                        <div>
                            <label for="message" class="block text-sm font-medium text-gray-400 mb-1">Message</label>
                            <textarea id="message" rows="4"
                                class="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Tell me about your project"></textarea>
                        </div>
                        <button type="submit" @mouseenter="isHoveringInteractive = true"
                            @mouseleave="isHoveringInteractive = false"
                            class="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-3 rounded-lg transition-all group hover:shadow-lg hover:shadow-indigo-500/20">
                            <span class="relative z-10">Send Message</span>
                            <span
                                class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        </button>
                    </form>

                    <div class="grid grid-cols-2 gap-4">
                        <a href="#" @mouseenter="isHoveringInteractive = true"
                            @mouseleave="isHoveringInteractive = false"
                            class="flex items-center justify-center bg-gray-700/50 p-4 rounded-xl hover:bg-gray-600/50 transition-colors border border-gray-600/50">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            <span>GitHub</span>
                        </a>
                        <a href="#" @mouseenter="isHoveringInteractive = true"
                            @mouseleave="isHoveringInteractive = false"
                            class="flex items-center justify-center bg-gray-700/50 p-4 rounded-xl hover:bg-gray-600/50 transition-colors border border-gray-600/50">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                            </svg>
                            <span>LinkedIn</span>
                        </a>
                        <a href="#" @mouseenter="isHoveringInteractive = true"
                            @mouseleave="isHoveringInteractive = false"
                            class="flex items-center justify-center col-span-2 bg-gray-700/50 p-4 rounded-xl hover:bg-gray-600/50 transition-colors border border-gray-600/50">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>Email</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="border-t border-gray-800 pt-8 relative z-10">
            <div class="flex flex-col md:flex-row justify-between items-center">
                <div class="text-lg mb-4 md:mb-0">
                    <span class="text-indigo-400">tech</span>Tahirou
                </div>
                <div class="flex space-x-6">
                    <a href="#" @mouseenter="isHoveringInteractive = true" @mouseleave="isHoveringInteractive = false"
                        class="text-gray-400 hover:text-indigo-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                    </a>
                    <a href="#" @mouseenter="isHoveringInteractive = true" @mouseleave="isHoveringInteractive = false"
                        class="text-gray-400 hover:text-indigo-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                        </svg>
                    </a>
                </div>
            </div>
            <div class="text-center text-gray-500 text-sm mt-6 pb-4">
                © 2025 TechTahirou. All rights reserved.
            </div>
        </footer>
    </div>
</template>
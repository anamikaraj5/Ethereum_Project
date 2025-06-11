# 📚 LearnChain – A Course DApp
## 📌 Project Overview
LearnChain is a decentralized learning platform built on the Ethereum blockchain that empowers learners and incentivizes them through token rewards. The platform supports a role-based system where an admin appoints educators, educators publish courses and modules, and students enroll by paying in Ether to access course content. As students complete modules, they earn LTN tokens as a reward for learning.

## ✨ Key Features
👑 Admin Role – The contract deployer becomes the admin and has exclusive rights to approve educators.

🎓 Educator Management – Admin can register educator addresses to allow course creation.

📘 Course Publishing – Only approved educators can add course and module content.

💰 Paid Enrollment – Students enroll in courses by paying the course fee in Ether.

🔓 Access Control – Only enrolled students can view course modules.

🪙 Token Rewards – On completing each module, students receive 100 LTN tokens.

## 🛠️ Technologies Used
⚛️ Frontend: React, Tailwind CSS, Ethers.js

🔐 Smart Contracts: Solidity (ERC-20 & custom logic)

🔗 Blockchain: Ethereum (local, Sepolia, or compatible networks)

🧪 Testing & Dev: Hardhat


## 📦 Smart Contracts Structure
LearnChain.sol – Manages admin, educators, courses, enrollments, and module completion.

LearnToken.sol – ERC-20 token (LTN) used as a reward.

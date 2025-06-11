const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers');
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('LearnChain', () => {
  async function deployLearnChain() {
    const [admin, educator, student] = await ethers.getSigners();
    const LearnChain = await ethers.getContractFactory('LearnChain');
    const learnChain = await LearnChain.deploy();

    return { admin, educator, student, learnChain };
  }

  it('should deploy contract successfully with token set', async () => {
    const { learnChain } = await loadFixture(deployLearnChain);
    const tokenAddress = await learnChain.token();
    expect(tokenAddress).to.be.properAddress;
  });

  it('admin can add educator', async () => {
    const { learnChain, educator } = await loadFixture(deployLearnChain);
    await learnChain.addEducator(educator.address);
    const isEducator = await learnChain.isEducator(educator.address);
    expect(isEducator).to.be.true;
  });

  it('educator can add course with modules', async () => {
    const { learnChain, educator } = await loadFixture(deployLearnChain);
    await learnChain.addEducator(educator.address);

    const modules = [
      { content: 'Intro', file: 'cid1' },
      { content: 'Advanced', file: 'cid2' }
    ];

    await learnChain.connect(educator).addCourse(
      1,
      'Solidity Basics',
      'Learn smart contracts',
      ethers.parseEther("0.1"),
      'image-url',
      'Educator1',
      modules
    );

    const course = await learnChain.courses(1);
    expect(course.coursename).to.equal('Solidity Basics');
  });

  it('student can enroll by sending ETH', async () => {
    const { learnChain, educator, student } = await loadFixture(deployLearnChain);
    await learnChain.addEducator(educator.address);

    const modules = [{ content: 'Intro', file: 'cid1' }];
    await learnChain.connect(educator).addCourse(
      2,
      'Web3 Course',
      'Web3 Intro',
      ethers.parseEther("0.05"),
      'image-url',
      'Educator2',
      modules
    );

    await learnChain.connect(student).enroll(2, { value: ethers.parseEther("0.05") });

    const isEnrolled = await learnChain.enrolled(2, student.address);
    expect(isEnrolled).to.be.true;
  });

  it('enrolled student can view module', async () => {
    const { learnChain, educator, student } = await loadFixture(deployLearnChain);
    await learnChain.addEducator(educator.address);

    const modules = [{ content: 'Content1', file: 'cid1' }];
    await learnChain.connect(educator).addCourse(
      3,
      'Module View Course',
      'Test',
      ethers.parseEther("0.01"),
      'image-url',
      'Educator3',
      modules
    );

    await learnChain.connect(student).enroll(3, { value: ethers.parseEther("0.01") });
    const module = await learnChain.connect(student).getModule(3, 0);
    expect(module[0]).to.equal('Content1');
  });

  it('student earns token after completing module', async () => {
    const { learnChain, educator, student } = await loadFixture(deployLearnChain);
    await learnChain.addEducator(educator.address);

    const modules = [{ content: 'Complete Me', file: 'cid3' }];
    await learnChain.connect(educator).addCourse(
      4,
      'Earn Token Course',
      'Token reward test',
      ethers.parseEther("0.01"),
      'image-url',
      'Educator4',
      modules
    );

    await learnChain.connect(student).enroll(4, { value: ethers.parseEther("0.01") });
    await learnChain.connect(student).completeModule(4, 0);

    const tokenAddress = await learnChain.token();
    const Token = await ethers.getContractAt('LearnToken', tokenAddress);
    const balance = await Token.balanceOf(student.address);

    expect(balance).to.equal(ethers.parseUnits("1", await Token.decimals()));
  });

});


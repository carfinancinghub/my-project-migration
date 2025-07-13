// File: onboardingController.js
// Path: backend/controllers/users/onboardingController.js

const getOnboardingProgress = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Mocked logic — can be replaced with real DB fetch
    const tasks = [
      { id: 1, name: 'Complete your profile', completed: false },
      { id: 2, name: 'Upload ID verification', completed: false },
      { id: 3, name: 'Visit your dashboard', completed: true },
    ];

    return res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch onboarding progress' });
  }
};

const completeOnboardingTask = async (req, res) => {
  try {
    const { taskId } = req.body;
    console.log(`Marking onboarding task ${taskId} as complete (stub)`);

    // Stub logic; normally you'd update user in DB
    return res.status(200).json({ message: 'Task marked as complete' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to complete onboarding task' });
  }
};

module.exports = {
  getOnboardingProgress,
  completeOnboardingTask,
};

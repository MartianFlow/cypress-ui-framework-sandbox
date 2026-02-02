/**
 * UserBuilder - Builder pattern for creating test user data
 * @description Fluent API for building user objects with various configurations
 * @class
 */
class UserBuilder {
  /**
   * Creates a UserBuilder instance with default values
   */
  constructor() {
    this._reset();
  }

  /**
   * Reset builder to default state
   * @private
   */
  _reset() {
    this._user = {
      id: null,
      email: null,
      password: 'Test@123456',
      firstName: 'Test',
      lastName: 'User',
      username: null,
      phone: null,
      role: 'user',
      status: 'active',
      avatar: null,
      address: null,
      preferences: {},
      metadata: {},
      createdAt: null,
      updatedAt: null,
    };
    return this;
  }

  // =================================
  // Identity Methods
  // =================================

  /**
   * Set user ID
   * @param {string|number} id - User ID
   * @returns {UserBuilder} This builder instance
   */
  withId(id) {
    this._user.id = id;
    return this;
  }

  /**
   * Set user email
   * @param {string} email - User email
   * @returns {UserBuilder} This builder instance
   */
  withEmail(email) {
    this._user.email = email;
    return this;
  }

  /**
   * Set random email
   * @param {string} [domain='test.com'] - Email domain
   * @returns {UserBuilder} This builder instance
   */
  withRandomEmail(domain = 'test.com') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5);
    this._user.email = `test_${timestamp}_${random}@${domain}`;
    return this;
  }

  /**
   * Set user password
   * @param {string} password - User password
   * @returns {UserBuilder} This builder instance
   */
  withPassword(password) {
    this._user.password = password;
    return this;
  }

  /**
   * Set username
   * @param {string} username - Username
   * @returns {UserBuilder} This builder instance
   */
  withUsername(username) {
    this._user.username = username;
    return this;
  }

  // =================================
  // Personal Info Methods
  // =================================

  /**
   * Set first name
   * @param {string} firstName - First name
   * @returns {UserBuilder} This builder instance
   */
  withFirstName(firstName) {
    this._user.firstName = firstName;
    return this;
  }

  /**
   * Set last name
   * @param {string} lastName - Last name
   * @returns {UserBuilder} This builder instance
   */
  withLastName(lastName) {
    this._user.lastName = lastName;
    return this;
  }

  /**
   * Set full name
   * @param {string} firstName - First name
   * @param {string} lastName - Last name
   * @returns {UserBuilder} This builder instance
   */
  withName(firstName, lastName) {
    this._user.firstName = firstName;
    this._user.lastName = lastName;
    return this;
  }

  /**
   * Set phone number
   * @param {string} phone - Phone number
   * @returns {UserBuilder} This builder instance
   */
  withPhone(phone) {
    this._user.phone = phone;
    return this;
  }

  /**
   * Set avatar URL
   * @param {string} avatar - Avatar URL
   * @returns {UserBuilder} This builder instance
   */
  withAvatar(avatar) {
    this._user.avatar = avatar;
    return this;
  }

  // =================================
  // Address Methods
  // =================================

  /**
   * Set user address
   * @param {Object} address - Address object
   * @param {string} address.street - Street address
   * @param {string} address.city - City
   * @param {string} address.state - State/Province
   * @param {string} address.zipCode - ZIP/Postal code
   * @param {string} address.country - Country
   * @returns {UserBuilder} This builder instance
   */
  withAddress(address) {
    this._user.address = {
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      zipCode: address.zipCode || '',
      country: address.country || 'USA',
    };
    return this;
  }

  /**
   * Set default US address
   * @returns {UserBuilder} This builder instance
   */
  withDefaultAddress() {
    this._user.address = {
      street: '123 Test Street',
      city: 'Test City',
      state: 'CA',
      zipCode: '12345',
      country: 'USA',
    };
    return this;
  }

  // =================================
  // Role & Status Methods
  // =================================

  /**
   * Set user role
   * @param {string} role - User role
   * @returns {UserBuilder} This builder instance
   */
  withRole(role) {
    this._user.role = role;
    return this;
  }

  /**
   * Set as admin user
   * @returns {UserBuilder} This builder instance
   */
  asAdmin() {
    this._user.role = 'admin';
    return this;
  }

  /**
   * Set as regular user
   * @returns {UserBuilder} This builder instance
   */
  asUser() {
    this._user.role = 'user';
    return this;
  }

  /**
   * Set as moderator
   * @returns {UserBuilder} This builder instance
   */
  asModerator() {
    this._user.role = 'moderator';
    return this;
  }

  /**
   * Set user status
   * @param {string} status - User status
   * @returns {UserBuilder} This builder instance
   */
  withStatus(status) {
    this._user.status = status;
    return this;
  }

  /**
   * Set as active user
   * @returns {UserBuilder} This builder instance
   */
  asActive() {
    this._user.status = 'active';
    return this;
  }

  /**
   * Set as inactive user
   * @returns {UserBuilder} This builder instance
   */
  asInactive() {
    this._user.status = 'inactive';
    return this;
  }

  /**
   * Set as pending user
   * @returns {UserBuilder} This builder instance
   */
  asPending() {
    this._user.status = 'pending';
    return this;
  }

  /**
   * Set as suspended user
   * @returns {UserBuilder} This builder instance
   */
  asSuspended() {
    this._user.status = 'suspended';
    return this;
  }

  // =================================
  // Preferences Methods
  // =================================

  /**
   * Set user preferences
   * @param {Object} preferences - Preferences object
   * @returns {UserBuilder} This builder instance
   */
  withPreferences(preferences) {
    this._user.preferences = { ...this._user.preferences, ...preferences };
    return this;
  }

  /**
   * Set notification preferences
   * @param {Object} notifications - Notification settings
   * @returns {UserBuilder} This builder instance
   */
  withNotifications(notifications) {
    this._user.preferences.notifications = {
      email: true,
      push: true,
      sms: false,
      ...notifications,
    };
    return this;
  }

  /**
   * Set theme preference
   * @param {string} theme - Theme ('light' or 'dark')
   * @returns {UserBuilder} This builder instance
   */
  withTheme(theme) {
    this._user.preferences.theme = theme;
    return this;
  }

  /**
   * Set language preference
   * @param {string} language - Language code
   * @returns {UserBuilder} This builder instance
   */
  withLanguage(language) {
    this._user.preferences.language = language;
    return this;
  }

  // =================================
  // Metadata Methods
  // =================================

  /**
   * Set user metadata
   * @param {Object} metadata - Metadata object
   * @returns {UserBuilder} This builder instance
   */
  withMetadata(metadata) {
    this._user.metadata = { ...this._user.metadata, ...metadata };
    return this;
  }

  /**
   * Set creation timestamp
   * @param {Date|string} date - Creation date
   * @returns {UserBuilder} This builder instance
   */
  createdAt(date) {
    this._user.createdAt = date instanceof Date ? date.toISOString() : date;
    return this;
  }

  /**
   * Set update timestamp
   * @param {Date|string} date - Update date
   * @returns {UserBuilder} This builder instance
   */
  updatedAt(date) {
    this._user.updatedAt = date instanceof Date ? date.toISOString() : date;
    return this;
  }

  // =================================
  // Preset Methods
  // =================================

  /**
   * Create standard test user
   * @returns {UserBuilder} This builder instance
   */
  asStandardUser() {
    return this
      .withRandomEmail()
      .withName('Test', 'User')
      .asUser()
      .asActive();
  }

  /**
   * Create admin test user
   * @returns {UserBuilder} This builder instance
   */
  asAdminUser() {
    return this
      .withRandomEmail('admin.test.com')
      .withName('Admin', 'User')
      .asAdmin()
      .asActive();
  }

  /**
   * Create new unverified user
   * @returns {UserBuilder} This builder instance
   */
  asNewUser() {
    return this
      .withRandomEmail()
      .withName('New', 'User')
      .asUser()
      .asPending();
  }

  // =================================
  // Build Methods
  // =================================

  /**
   * Build the user object
   * @returns {Object} Complete user object
   */
  build() {
    // Generate email if not set
    if (!this._user.email) {
      this.withRandomEmail();
    }

    // Generate username from email if not set
    if (!this._user.username) {
      this._user.username = this._user.email.split('@')[0];
    }

    // Set timestamps if not set
    const now = new Date().toISOString();
    if (!this._user.createdAt) {
      this._user.createdAt = now;
    }
    if (!this._user.updatedAt) {
      this._user.updatedAt = now;
    }

    // Create a copy of the user object
    const user = { ...this._user };

    // Reset for next build
    this._reset();

    return user;
  }

  /**
   * Build only credentials (email and password)
   * @returns {Object} Credentials object
   */
  buildCredentials() {
    const user = this.build();
    return {
      email: user.email,
      password: user.password,
    };
  }

  /**
   * Build for registration form
   * @returns {Object} Registration data
   */
  buildForRegistration() {
    const user = this.build();
    return {
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    };
  }

  /**
   * Build for profile update
   * @returns {Object} Profile update data
   */
  buildForProfileUpdate() {
    const user = this.build();
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
      address: user.address,
      preferences: user.preferences,
    };
  }

  /**
   * Build for API creation
   * @returns {Object} API-ready user data
   */
  buildForApi() {
    const user = this.build();
    // Remove null values
    return Object.fromEntries(
      Object.entries(user).filter(([_, value]) => value !== null)
    );
  }

  // =================================
  // Static Factory Methods
  // =================================

  /**
   * Create a new builder instance
   * @returns {UserBuilder} New builder instance
   */
  static create() {
    return new UserBuilder();
  }

  /**
   * Create a standard user quickly
   * @returns {Object} Standard user object
   */
  static standardUser() {
    return new UserBuilder().asStandardUser().build();
  }

  /**
   * Create an admin user quickly
   * @returns {Object} Admin user object
   */
  static adminUser() {
    return new UserBuilder().asAdminUser().build();
  }

  /**
   * Create multiple users
   * @param {number} count - Number of users to create
   * @param {Function} [customizer] - Optional customizer function
   * @returns {Object[]} Array of user objects
   */
  static createMany(count, customizer) {
    const users = [];
    for (let i = 0; i < count; i++) {
      const builder = new UserBuilder().asStandardUser();
      if (customizer) {
        customizer(builder, i);
      }
      users.push(builder.build());
    }
    return users;
  }
}

export default UserBuilder;

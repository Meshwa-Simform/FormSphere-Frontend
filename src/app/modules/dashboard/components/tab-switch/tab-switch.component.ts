import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-tab-switch',
  // prettier-ignore
  // eslint-disable-next-line 
  standalone: false,
  templateUrl: './tab-switch.component.html',
  styleUrl: './tab-switch.component.css'
})
export class TabSwitchComponent implements OnDestroy {
  currentTab = 0;
  tabs = ['forms', 'signatures'];
  intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Auto-switch every 4 seconds
    this.startAutoSwitch();
  }

  // Method to switch tabs
  switchTab(tabId: string): void {
    // Clear the interval to stop auto-switching when a tab is clicked
    this.stopAutoSwitch();

    // Remove 'active' class from all tabs and contents
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));

    // Add 'active' class to the clicked tab and its corresponding content
    const tabElement = document.querySelector(`.tab:nth-child(${this.tabs.indexOf(tabId) + 1})`);
    if (tabElement) {
      tabElement.classList.add('active');
    }
    const tabContent = document.getElementById(tabId);
    if (tabContent) {
      tabContent.classList.add('active');
    }

    // Update the current tab index
    this.currentTab = this.tabs.indexOf(tabId);

    // Restart the auto-switch interval
    this.startAutoSwitch();
  }

  // Start the auto-switch interval
  startAutoSwitch(): void {
    this.intervalId = setInterval(() => {
      this.currentTab = (this.currentTab + 1) % this.tabs.length;
      this.switchTab(this.tabs[this.currentTab]);
    }, 4000); // Switch every 4 seconds
  }

  // Stop the auto-switch interval
  stopAutoSwitch(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Cleanup the interval when the component is destroyed
  ngOnDestroy(): void {
    this.stopAutoSwitch();
  }
}

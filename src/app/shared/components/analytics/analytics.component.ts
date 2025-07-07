import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ResponseService } from '../../../services/response/response.service';
import { Responses } from '../../../modules/my-forms/interface/response';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { ChartTypeRegistry } from 'chart.js';
import { FormsModule } from '@angular/forms';
import type { TooltipItem } from 'chart.js';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    MaterialModule,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
})
export class AnalyticsComponent implements OnInit {
  formId: string | null = null;
  responses: Responses[] = [];
  totalResponses = 0;
  questionAnalytics: Record<string, Record<string, number>> = {};
  answerEmails: Record<string, Record<string, string[]>> = {};
  questionTypes: Record<string, string> = {};
  selectedChartType: keyof ChartTypeRegistry = 'pie';
  allEmails: string[] = [];
  emails: string[] = [];
  selectedEmail = '';
  filteredResponses: Responses[] = [];

  constructor(
    private _route: ActivatedRoute,
    private _responseService: ResponseService,
    private _authService: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.formId = this._route.snapshot.paramMap.get('formId');
    if (this.formId) {
      this.getResponses(this.formId);
    }
  }

  getResponses(formId: string): void {
    this._responseService.getResponsesByFormId(formId).subscribe({
      next: (data) => {
        this.responses = data.data.responses;
        this.allEmails = Array.from(
          new Set(
            this.responses
              .map((r) => r.userEmail)
              .filter((e): e is string => !!e)
          )
        );
        this.emails = this.responses
          .map((r) => r.userEmail)
          .filter((e): e is string => !!e);
        this.selectedEmail = ''; // Default: show all
        this.applyEmailFilter();
      },
      error: (err) => {
        console.error('Error fetching responses:', err);
      },
    });
  }

  applyEmailFilter(): void {
    // If selectedEmail is empty, show all
    if (!this.selectedEmail) {
      this.filteredResponses = [...this.responses];
      this.totalResponses = this.filteredResponses.length;
    } else {
      this.filteredResponses = this.responses.filter(
        (r) =>
          typeof r.userEmail === 'string' && r.userEmail === this.selectedEmail
      );
      this.totalResponses = this.filteredResponses.length;
    }
    this.calculateQuestionAnalytics();
  }

  calculateQuestionAnalytics(): void {
    this.questionAnalytics = {};
    this.answerEmails = {};
    this.questionTypes = {};
    (this.filteredResponses || []).forEach((response) => {
      response.answers.forEach((answer) => {
        // Save the type for each question text
        if (!this.questionTypes[answer.questionText]) {
          this.questionTypes[answer.questionText] = answer.questionType;
        }
        if (!this.questionAnalytics[answer.questionText]) {
          this.questionAnalytics[answer.questionText] = {};
          this.answerEmails[answer.questionText] = {};
        }
        const responseAnswer = answer.responseAnswer || 'No Answer';
        if (!this.questionAnalytics[answer.questionText][responseAnswer]) {
          this.questionAnalytics[answer.questionText][responseAnswer] = 0;
          this.answerEmails[answer.questionText][responseAnswer] = [];
        }
        this.questionAnalytics[answer.questionText][responseAnswer]++;
        if (response.userEmail) {
          this.answerEmails[answer.questionText][responseAnswer].push(
            response.userEmail
          );
        }
      });
    });
  }

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label:() => ''
        },
      },
    },
  };

  getSummaryChartLabels(): string[] {
    return ['Total Responses'];
  }

  getSummaryChartData(): { data: number[]; label: string }[] {
    return [
      {
        data: [this.totalResponses],
        label: 'Summary Analytics',
      },
    ];
  }

  getChartLabels(data: Record<string, number>): string[] {
    return Object.keys(data).map((label) => {
      // Truncate labels longer than 30 characters
      return label.length > 30 ? label.substring(0, 27) + '...' : label;
    });
  }

  getChartData(
    data: Record<string, number>
  ): { data: number[]; label: string }[] {
    return [{ data: Object.values(data), label: 'Responses' }];
  }

  logoutUser(): void {
    this._authService.logoutUser().subscribe();
    this._router.navigate(['/auth/login']);
  }

  getChartOptions(questionText: string) {
    const answerEmails = this.answerEmails;
    // Return chart options with a closure for the tooltip callback
    return {
      ...this.chartOptions,
      plugins: {
        ...this.chartOptions.plugins,
        tooltip: {
          ...this.chartOptions.plugins.tooltip,
          callbacks: {
            label: (context: TooltipItem<keyof ChartTypeRegistry>) => {
              const answer = context.label;
              const count = context.parsed;
              const emails =
                answerEmails[questionText] &&
                answerEmails[questionText][answer]
                  ? answerEmails[questionText][answer]
                  : [];
              const lines = [`${answer}: ${count}`];
              if (emails.length > 0) {
                lines.push('Emails:');
                lines.push(...emails);
              }
              return lines;
            },
          },
        },
      },
    };
  }

  getChartOptionsforSummary(emailArray: string[]) {
    return{
      ...this.chartOptions,
      plugins: {
        ...this.chartOptions.plugins,
        tooltip: {
          ...this.chartOptions.plugins.tooltip,
          callbacks: {
            label: (context: TooltipItem<keyof ChartTypeRegistry>) => {
              const answer = context.label;
              const count = context.parsed;

              const lines = [`${answer}: ${count}`];

              if (emailArray.length > 0) {
                lines.push('Emails:');
                lines.push(...emailArray);
              }

              return lines;
            },
          },
        },
      },
    }
  }

  // Add handler for email selection change
  // HTML select multiple always returns string[]
  onEmailSelectionChange(selected: string): void {
    this.selectedEmail = selected;
    this.applyEmailFilter();
  }
}

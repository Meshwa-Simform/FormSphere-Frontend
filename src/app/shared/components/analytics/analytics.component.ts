import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service'; // Import AuthService
import { ResponseService } from '../../../services/response/response.service';
import { Responses } from '../../../modules/my-forms/interface/response';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { ChartTypeRegistry } from 'chart.js';
import { FormsModule } from '@angular/forms';

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
  selectedChartType: keyof ChartTypeRegistry = 'pie';

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
        this.totalResponses = data.data.total;
        this.calculateQuestionAnalytics();
      },
      error: (err) => {
        console.error('Error fetching responses:', err);
      },
    });
  }

  calculateQuestionAnalytics(): void {
    this.responses.forEach((response) => {
      response.answers.forEach((answer) => {
        if (!this.questionAnalytics[answer.questionText]) {
          this.questionAnalytics[answer.questionText] = {};
        }
        const responseAnswer = answer.responseAnswer || 'No Answer';
        if (!this.questionAnalytics[answer.questionText][responseAnswer]) {
          this.questionAnalytics[answer.questionText][responseAnswer] = 0;
        }
        this.questionAnalytics[answer.questionText][responseAnswer]++;
      });
    });
  }

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
}

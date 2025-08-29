
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertTriangle, MessageSquare } from "lucide-react";
import { RubricScore, DetailedEvaluationProps } from '@/types/admin';

const DetailedEvaluationDisplay: React.FC<DetailedEvaluationProps> = ({
  score,
  evaluation,
  strengths = [],
  areas_for_improvement = [],
  feedback
}) => {
  // Extract rubric scores from evaluation data
  const rubricScores: RubricScore = evaluation?.rubric_scores || evaluation?.detailed_breakdown || {};
  
  const rubricParameters = [
    {
      category: "English Language Proficiency",
      items: [
        { name: "Grammar & Sentence Structure", score: rubricScores.grammar_sentence_structure, max: 25, threshold: 20 },
        { name: "Pronunciation", score: rubricScores.pronunciation, max: 15, threshold: 10 }
      ]
    },
    {
      category: "Teaching Experience", 
      items: [
        { name: "Years of Experience (4-16)", score: rubricScores.years_teaching_experience, max: 15 },
        { name: "Mode of Teaching", score: rubricScores.mode_of_teaching, max: 5 },
        { name: "Program Interest & Expertise", score: rubricScores.program_interest, max: 5 }
      ]
    },
    {
      category: "Availability",
      items: [
        { name: "Weekday Working Hours", score: rubricScores.weekday_hours, max: 15 },
        { name: "Weekend Working Hours", score: rubricScores.weekend_hours, max: 10 }
      ]
    },
    {
      category: "Qualification & Certifications",
      items: [
        { name: "Highest Academic Qualification", score: rubricScores.highest_qualification, max: 10, threshold: 5 },
        { name: "Additional Teaching Certifications", score: rubricScores.additional_certifications, max: 5 }
      ]
    },
    {
      category: "Language Skills",
      items: [
        { name: "Languages Spoken", score: rubricScores.languages_spoken, max: 5 }
      ]
    }
  ];

  const getStatusIcon = (score: number, threshold?: number) => {
    if (threshold && score < threshold) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    } else if (threshold && score >= threshold) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (score >= (rubricParameters.find(cat => cat.items.some(item => item.threshold))?.items.find(item => item.threshold)?.max || 0) * 0.8) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (score >= (rubricParameters.find(cat => cat.items.some(item => item.threshold))?.items.find(item => item.threshold)?.max || 0) * 0.6) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const suitabilityPercentage = score;
  const isPassing = suitabilityPercentage >= 60;

  return (
    <div className="space-y-6">
      {/* Overall Result Summary */}
      <Card className="border-2 border-bambinos-blue/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-bambinos-blue">ToughTongue Evaluation Summary</span>
            <Badge className={`text-lg px-4 py-2 ${isPassing ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isPassing ? 'PASSED' : 'FAILED'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-4xl font-bold ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
                {suitabilityPercentage}%
              </div>
              <p className="text-sm text-gray-600">Final Total Score</p>
              <p className="text-xs text-gray-500 mt-1">Threshold: 60%</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-bambinos-blue">
                {score}/100
              </div>
              <p className="text-sm text-gray-600">Total Points</p>
            </div>
            <div className="text-center">
              <Progress 
                value={suitabilityPercentage} 
                className="w-full mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">Performance Level</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Evaluation Feedback - Made more prominent */}
      {feedback && (
        <Card className="border-2 border-blue-300 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center text-xl">
              <MessageSquare className="h-6 w-6 mr-3" />
              AI Evaluation Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-6 rounded-lg border border-blue-200 shadow-sm">
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-base">
                  {feedback}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Rubric Breakdown */}
      {Object.keys(rubricScores).length > 0 && (
        <Card className="border-bambinos-blue/20">
          <CardHeader>
            <CardTitle className="text-bambinos-blue">Detailed Rubric Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {rubricParameters.map((category, categoryIndex) => (
                <div key={categoryIndex} className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-semibold text-bambinos-blue mb-3">{category.category}</h4>
                  <div className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(item.score || 0, item.threshold)}
                          <span className="text-sm font-medium">{item.name}</span>
                          {item.threshold && (
                            <span className="text-xs text-gray-500">(Min: {item.threshold})</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold">
                            {item.score || 0}/{item.max}
                          </span>
                          <div className="w-20">
                            <Progress 
                              value={((item.score || 0) / item.max) * 100} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strengths and Improvements */}
      <div className="grid md:grid-cols-2 gap-6">
        {strengths.length > 0 && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {strengths.map((strength, index) => (
                  <li key={index} className="text-sm text-green-700 flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {areas_for_improvement.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {areas_for_improvement.map((area, index) => (
                  <li key={index} className="text-sm text-orange-700 flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    {area}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Technical Data (Collapsible) */}
      {evaluation && (
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <details className="bg-gray-100 p-4 rounded">
              <summary className="font-medium text-bambinos-blue cursor-pointer">
                🔍 Raw Evaluation Data (Technical View)
              </summary>
              <pre className="text-xs bg-white p-3 rounded mt-2 overflow-auto max-h-96">
                {JSON.stringify(evaluation, null, 2)}
              </pre>
            </details>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DetailedEvaluationDisplay;

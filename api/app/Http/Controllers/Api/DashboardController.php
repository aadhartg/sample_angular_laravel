<?php

namespace App\Http\Controllers\Api\Tutor;

use Akaunting\Money\Money;
use App\Booking;
use App\Course;
use App\CourseReview;
use App\CourseSession;
use App\FavouriteTutor;
use App\SessionReview;
use App\TutorReview;
use App\UserProfile;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\TutorAvailabilitySlot;
use App\Http\Traits\CommonTrait;

/**
 * Class DashboardController
 * @package App\Http\Controllers\Api\Tutor
 */
class DashboardController extends Controller
{

    use CommonTrait;

    const TYPE_WEEK = 'week';
    const TYPE_MONTH = 'month';
    const TYPE_YEAR = 'year';

    
    /**
     * @purpose to get monthly income for tutor
     * @method monthlyIncomeAction
     * @date 2019-10-11
     * @param Request $request
     * @return array
     */
    public function monthlyIncomeAction(Request $request)
    {
        if ($request->has('year') && $request->get('year') != '')
            $year = $request->get('year');
        else
            $year = date('Y', strtotime('now'));

        $bookings = \App\TutorEarning::select('platform_fee', 'paid_amount', DB::raw("amount_in"), DB::raw("amount_out"), "created_at", "id")
            ->where('amount_in', '!=', '')
            ->whereRaw('YEAR(created_at) =' . $year)
            ->whereTutorId(Auth::id())
            ->orderBy(DB::raw("month(created_at)", "asc"))
            ->get();

        $arr = ["Jan" => 0, "Feb" => 0, "Mar" => 0, "Apr" => 0, "May" => 0, "Jun" => 0, "Jul" => 0, "Aug" => 0, "Sep" => 0, "Oct" => 0, "Nov" => 0, "Dec" => 0];
        $total = $bookings->sum('paid_amount');

        foreach ($bookings as $booking) {
            $start_time = $this->convertToLocalTz($booking->created_at, $request->header('Timezone'))->format("M");
            $arr[$start_time] += $booking->paid_amount;
        }

        $years = range(date("Y"), date("Y", strtotime('-5 years')));

        $responseArray = [
            'totalEarning' => Money::INR($total * 100)->format(),
            'average_income' => ($total) ? Money::INR(($total / 12) * 100)->format() : 0,
            'data' => $arr,
            'year' => $year,
            'years' => $years,
            'success' => true
        ];
        return response()->json($responseArray);
    }
    /**
     * @purpose to get overall statistics sessions
     * @method overallStatisticsAction
     * @date 2019-10-11
     * @param Request $request
     * @return array
     */
    public function overallStatisticsAction(Request $request)
    {
        $sessions = CourseSession::whereUserId(Auth::id())->count();
        $one2one = Booking::whereBookingType(Booking::TYPE_SLOT)
            ->whereTutorId(Auth::id())
            ->count();
        $sessionsCompleted = CourseSession::whereUserId(Auth::id())
            ->whereIn('status', [Booking::CLOSED, Booking::COMPLETE])
            ->count();
        $one2oneCompleted = Booking::whereBookingType(Booking::TYPE_SLOT)
            ->whereTutorId(Auth::id())
            ->whereIn('order_status', [Booking::CLOSED, Booking::COMPLETE])
            ->count();

        $sessionsCompleted = $sessionsCompleted + $one2oneCompleted;
        $sessions = $sessions + $one2one;

        //tutor review

        $over_all_rating['rating'] = 0;
        $over_all_rating['review_count'] = 0;

        $review = TutorReview::whereTutorId(Auth::id())->select(
            DB::raw("COALESCE(NULLIF(rating,''), '0') as rating"))
            ->get();
        $response['tutor_reviews']['average_rating'] = number_format($review->avg('rating'), 1);
        $response['tutor_reviews']['reviews_count'] = count($review);

        $response['course_offered'] = Course::whereNull('cancel_at')->whereUserId(Auth::id())->count();
        $response['session_requests'] = Booking::where(function ($query) {
            return $query->whereTutorId(Auth::id())
                ->whereBookingType(Booking::TYPE_SLOT);
        })->whereIn('order_status', [
            Booking::REQUESTED,
        ])->whereExists(function ($query) {
            return $query->from('tutor_availability_slots')
                ->where(DB::raw("CONCAT(`start_time`)"), '>=', date('Y-m-d H:i'))
                ->whereRaw('tutor_availability_slots.id = bookings.reference_id');
        })->count();
        $response['completeSessions'] = $sessionsCompleted;
        $response['session'] = $sessions;
        $response['sessionsCompleted'] = $sessionsCompleted;
        $response['totalEarnings'] = \App\TutorEarning::whereTutorId(Auth::id())
            ->whereStatus(\App\Booking::PAID)
            ->sum('paid_amount');

        $response['totalEarnings'] = Money::INR($response['totalEarnings'] * 100)->format();
        $response['totalFollowers'] = FavouriteTutor::whereTutorId(Auth::id())->count();
        $response['totalHours'] = Booking::select(DB::raw("TIMESTAMPDIFF(SECOND, start_time, end_time) / (60*60) as hours"), "start_time", "end_time")
            ->join('tutor_availability_slots', 'tutor_availability_slots.id', 'bookings.reference_id')
            ->where('bookings.tutor_id', Auth::id())
            ->where('booking_type', Booking::TYPE_SLOT)
            ->whereIn('order_status', [Booking::CLOSED, Booking::COMPLETE])
            ->get();
        $response['totalHours'] = number_format(abs($response['totalHours']->sum('hours')), 2);
        $response['tutor_slug'] = UserProfile::select('profile_slug')->whereUserId(Auth::id())->first()->profile_slug;
        return response()->json($response);
    }
}

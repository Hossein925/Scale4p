
import React, { useState, useEffect } from 'react';
import { BradenScores, BradenQScores } from '../types';
import AssessmentResultDisplay from './common/AssessmentResultDisplay';
import AssessmentRow from './common/AssessmentRow';
import ModuleHeader from './common/ModuleHeader';

const getBradenRecommendations = (riskLevel: string): string[] => {
  switch(riskLevel) {
    case 'none':
      return ["ادامه مراقبت‌های روتین پرستاری.", "ارزیابی مجدد ریسک در صورت هرگونه تغییر در وضعیت بیمار."];
    case 'mild':
      return ["استفاده از تشک مواج یا تشک‌های کاهنده فشار.", "تغییر پوزیشن بیمار حداقل هر ۴ ساعت.", "مدیریت رطوبت پوست و استفاده از کرم‌های محافظ.", "اطمینان از دریافت مایعات و تغذیه کافی."];
    case 'moderate':
      return ["تغییر پوزیشن بیمار هر ۲ ساعت.", "محافظت کامل از نواحی پرفشار (پاشنه، ساکروم) با استفاده از بالشتک.", "درخواست مشاوره تغذیه جهت بهینه‌سازی پروتئین و کالری دریافتی.", "بازبینی و تنظیم برنامه مراقبت از پوست."];
    case 'high':
      return ["تغییر پوزیشن دقیق بیمار هر ۱ الی ۲ ساعت (حتی با زاویه کم).", "استفاده از تشک‌های پیشرفته کاهنده فشار (مانند low-air-loss).", "اجرای برنامه دقیق مدیریت پوست و ثبت روزانه وضعیت پوست.", "به حداقل رساندن نیروهای سایش و کشش حین جابجایی."];
    case 'very_high':
      return ["اجرای حداکثر اقدامات پیشگیرانه؛ در نظر گرفتن استفاده از تخت‌های مخصوص.", "تغییر پوزیشن مکرر و با دقت بالا طبق پروتکل بخش.", "ارزیابی روزانه پوست توسط پرستار مسئول و ثبت دقیق هرگونه تغییر.", "مداخله تهاجمی تغذیه‌ای با هماهنگی تیم درمان."];
    default:
      return [];
  }
};

const BradenScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
    const [scores, setScores] = useState<BradenScores>({ sensory: 4, moisture: 4, activity: 4, mobility: 4, nutrition: 4, friction: 3 });

    useEffect(() => {
        const totalScore = (Object.values(scores) as number[]).reduce((sum, val) => sum + val, 0);
        let interpretation = "", color = "", icon = "", riskLevel = "";
        if (totalScore <= 9) {
          riskLevel = "very_high";
          interpretation = "ریسک بسیار بالا (Very High Risk)";
          color = "bg-red-800";
          icon = "🆘";
        } else if (totalScore <= 12) {
          riskLevel = "high";
          interpretation = "ریسک بالا (High Risk)";
          color = "bg-rose-700";
          icon = "🚨";
        } else if (totalScore <= 14) {
          riskLevel = "moderate";
          interpretation = "ریسک متوسط (Moderate Risk)";
          color = "bg-orange-600";
          icon = "🟠";
        } else if (totalScore <= 18) {
          riskLevel = "mild";
          interpretation = "ریسک خفیف / پیشگیرانه (At Risk)";
          color = "bg-amber-500";
          icon = "🟡";
        } else {
          riskLevel = "none";
          interpretation = "ریسک وجود ندارد (No Risk)";
          color = "bg-emerald-600";
          icon = "✅";
        }
        const recommendations = getBradenRecommendations(riskLevel);
        onResult({ score: totalScore, interpretation, color, icon, recommendations, toolUsed: 'Braden' });
      }, [scores]);
    
      const handleSelect = (category: keyof BradenScores, value: number) => {
        setScores(prev => ({ ...prev, [category]: value }));
      };

    return (
        <div className="grid gap-12 pt-8">
            <AssessmentRow title="۱. درک حسی" currentValue={scores.sensory} onSelect={(v) => handleSelect('sensory', v)} options={[{label: 'کاملا محدود (عدم پاسخ به محرک دردناک)', value: 1}, {label: 'خیلی محدود (پاسخ فقط به درد)', value: 2}, {label: 'کمی محدود (پاسخ به دستور کلامی)', value: 3}, {label: 'بدون محدودیت (پاسخ کلامی و بیان درد)', value: 4}]} />
            <AssessmentRow title="۲. رطوبت پوست" currentValue={scores.moisture} onSelect={(v) => handleSelect('moisture', v)} options={[{label: 'رطوبت مداوم', value: 1}, {label: 'خیلی مرطوب (ملحفه هر شیفت تعویض)', value: 2}, {label: 'گاهی مرطوب (ملحفه روزی یکبار تعویض)', value: 3}, {label: 'بندرت مرطوب (پوست خشک)', value: 4}]} />
            <AssessmentRow title="۳. فعالیت فیزیکی" currentValue={scores.activity} onSelect={(v) => handleSelect('activity', v)} options={[{label: 'محدود به تخت (CBR)', value: 1}, {label: 'محدود به صندلی', value: 2}, {label: 'گاهی راه می‌رود', value: 3}, {label: 'مکرر راه می‌رود', value: 4}]} />
            <AssessmentRow title="۴. تحرک (تغییر پوزیشن)" currentValue={scores.mobility} onSelect={(v) => handleSelect('mobility', v)} options={[{label: 'کاملا بی‌حرکت', value: 1}, {label: 'حرکت بسیار محدود', value: 2}, {label: 'اندکی محدود', value: 3}, {label: 'بدون محدودیت', value: 4}]} />
            <AssessmentRow title="۵. تغذیه" currentValue={scores.nutrition} onSelect={(v) => handleSelect('nutrition', v)} options={[{label: 'بسیار کم (NPO/مایعات صاف)', value: 1}, {label: 'ناکافی (کمتر از نصف غذا یا NGT)', value: 2}, {label: 'کافی (بیش از نصف غذا)', value: 3}, {label: 'عالی (تمام وعده‌ها را کامل میخورد)', value: 4}]} />
            <AssessmentRow title="۶. اصطکاک و سایش" currentValue={scores.friction} onSelect={(v) => handleSelect('friction', v)} options={[{label: 'مشکل دار (نیاز به کمک زیاد برای جابجایی)', value: 1}, {label: 'مشکل احتمالی (نیاز به کمک کم)', value: 2}, {label: 'بدون مشکل (جابجایی مستقل)', value: 3}]} />
        </div>
    );
};

const getBradenQRecommendations = (riskLevel: string): string[] => {
  switch(riskLevel) {
    case 'none':
      return [
        "ادامه مراقبت‌های معمول و روتین پوستی نوزاد/کودک.",
        "پایش روزانه و ثبت تغییرات احتمالی در وضعیت تحرک، رطوبت یا تغذیه کودک.",
        "ارزیابی مجدد ریسک در صورت تغییر ناگهانی وضعیت عمومی یا انجام عمل جراحی."
      ];
    case 'low':
      return [
        "بررسی منظم وضعیت پوست به خصوص در نقاط تحت فشار (مانند پشت سر در نوزادان و ساکروم).",
        "تغییر موقعیت مکرر کودک و تشویق به تحرک فعال در صورت امکان.",
        "کنترل دقیق رطوبت پوست و تعویض به موقع پوشک یا ملحفه کودک.",
        "اطمینان از دریافت کافی و متناسب مایعات و تغذیه روزانه کودک."
      ];
    case 'moderate':
      return [
        "پوزیشن‌دهی منظم و تغییر وضعیت بیمار حداقل هر ۳ ساعت با ثبت دقیق در کاردکس.",
        "استفاده از پانسمان‌های فوم یا هیدروکلوئید محافظ روی برجستگی‌های استخوانی پرفشار (ساکروم، پاشنه پا و پشت سر).",
        "مدیریت رطوبت پوست با استفاده از کرم‌های محافظ اکسید دوزنگ یا بریر پوستی.",
        "ارزیابی دقیق وضعیت همودینامیک، فشار خون شریانی متوسط (MAP) و پایش مستمر اشباع اکسیژن بافتی.",
        "بررسی نیاز به تشک‌های کاهنده فشار متناسب با جثه اطفال."
      ];
    case 'high':
      return [
        "استفاده فوری از تشک‌های پیشرفته مواج مخصوص اطفال یا سطوح کاهنده فشار هوا.",
        "تغییر وضعیت دقیق و با ظرافت بیمار هر ۲ ساعت به ویژه جهت محافظت از پشت سر (شایع‌ترین محل در کودکان).",
        "به کارگیری رینگ‌های ژلی یا رینگ فوم برای کاهش فشار از روی استخوان پس‌سری نوزادان.",
        "مدیریت جدی رطوبت و ادرار؛ استفاده از پدهای جاذب رطوبت فوق‌العاده باکیفیت و محافظ پوست قوی.",
        "درخواست مشاوره فوری با متخصص تغذیه کودکان جهت غنی‌سازی رژیم غذایی، تغذیه با لوله یا مکمل‌های پرپروتئین.",
        "پایش مداوم اکسیژن‌رسانی بافتی، زمان پر شدن مویرگی و سطح هموگلوبین بیمار جهت بهبود اکسیژن‌رسانی به پوست."
      ];
    default:
      return [];
  }
};

const BradenQScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
    const [scores, setScores] = useState<BradenQScores>({ sensory: 4, moisture: 4, activity: 4, mobility: 4, nutrition: 4, friction: 4, perfusion: 4 });

    useEffect(() => {
        const totalScore = (Object.values(scores) as number[]).reduce((sum, val) => sum + val, 0);
        let interpretation = "", color = "", icon = "", riskLevel = "";
        
        if (totalScore < 16) {
          riskLevel = "high";
          interpretation = "خطر زیاد بروز زخم فشاری (High Risk)";
          color = "bg-rose-700";
          icon = "🚨";
        } else if (totalScore <= 21) {
          riskLevel = "moderate";
          interpretation = "خطر متوسط بروز زخم فشاری (Moderate Risk)";
          color = "bg-orange-600";
          icon = "🟠";
        } else if (totalScore <= 25) {
          riskLevel = "low";
          interpretation = "خطر پایین بروز زخم فشاری (Low Risk)";
          color = "bg-amber-500";
          icon = "🟡";
        } else {
          riskLevel = "none";
          interpretation = "خطر بسیار ناچیز یا بدون خطر (No/Minimal Risk)";
          color = "bg-emerald-600";
          icon = "✅";
        }
        
        const recommendations = getBradenQRecommendations(riskLevel);
        onResult({ score: totalScore, interpretation, color, icon, recommendations, toolUsed: 'BradenQ' });
      }, [scores]);
    
      const handleSelect = (category: keyof BradenQScores, value: number) => {
        setScores(prev => ({ ...prev, [category]: value }));
      };

    return (
        <div className="grid gap-12 pt-8">
            <AssessmentRow 
              title="۱. سلامت درک حسی (Sensory Perception)" 
              description="واکنش بیمار نسبت به درد ناشی از فشار متناسب با رشد و تکامل"
              currentValue={scores.sensory} 
              onSelect={(v) => handleSelect('sensory', v)} 
              options={[
                {label: 'کاملاً محدود شده (عدم پاسخ به درد به دلیل بیهوشی/دارو یا فقدان حس در اکثر نقاط)', value: 1}, 
                {label: 'بسیار محدود شده (پاسخ فقط به محرک درد با ناله/بی‌قراری، یا عدم احساس درد در نصف بدن)', value: 2}, 
                {label: 'نسبتاً محدود شده (پاسخ به کلام اما عدم توانایی همیشگی در بیان درد یا نیاز به پوزیشن)', value: 3}, 
                {label: 'سالم و بدون ضعف (پاسخ کامل به دستورات کلامی و پاسخ مناسب به محرک‌های درد و فشار)', value: 4}
              ]} 
            />
            <AssessmentRow 
              title="۲. رطوبت پوست بدن (Moisture)" 
              description="میزان خیس بودن پوست ناشی از تعریق، ادرار یا سایر ترشحات"
              currentValue={scores.moisture} 
              onSelect={(v) => handleSelect('moisture', v)} 
              options={[
                {label: 'همواره مرطوب (خیس بودن مداوم پوست و مشاهده نم با هر حرکت یا تغییر وضعیت)', value: 1}, 
                {label: 'بسیار مرطوب (پوست اغلب مرطوب است؛ نیاز به تعویض ملحفه‌ها حداقل هر ۸ ساعت)', value: 2}, 
                {label: 'گاهی مرطوب (پوست گاهی مرطوب است؛ نیاز به تعویض ملحفه حدوداً هر ۱۲ ساعت)', value: 3}, 
                {label: 'به ندرت مرطوب (معمولاً پوست خشک؛ تعویض پوشک روتین و تعویض ملحفه هر ۲۴ ساعت)', value: 4}
              ]} 
            />
            <AssessmentRow 
              title="۳. فعالیت فیزیکی (Activity)" 
              description="میزان تحرک و فعالیت فیزیکی کودک خارج از تخت خواب"
              currentValue={scores.activity} 
              onSelect={(v) => handleSelect('activity', v)} 
              options={[
                {label: 'محدود به تخت (بیمار توانایی یا اجازه خروج از تخت را ندارد)', value: 1}, 
                {label: 'محدود به صندلی (توانایی راه رفتن بسیار محدود/ناچیز؛ عدم تحمل وزن و نیاز به ویلچر)', value: 2}, 
                {label: 'گاهی راه می‌رود (راه رفتن فواصل کوتاه با/بدون کمک؛ اغلب اوقات در تخت یا صندلی)', value: 3}, 
                {label: 'مرتب راه می‌رود (مستقل؛ حداقل ۲ بار راه رفتن خارج اتاق و درون اتاق هر ۲ ساعت در بیداری)', value: 4}
              ]} 
            />
            <AssessmentRow 
              title="۴. توانایی تغییر وضعیت و جابجایی (Mobility)" 
              description="ارزیابی توانایی کنترل و تغییر موقعیت قرارگیری بدن یا اندام‌ها"
              currentValue={scores.mobility} 
              onSelect={(v) => handleSelect('mobility', v)} 
              options={[
                {label: 'کاملاً بی‌حرکت (ناتوانی کامل در ایجاد کوچک‌ترین تغییر در پوزیشن بدن یا اندام‌ها بدون کمک)', value: 1}, 
                {label: 'بسیار محدود (تغییر وضعیت جزئی/گهگاه اندام‌ها اما ناتوان در چرخیدن مستقل و کامل)', value: 2}, 
                {label: 'محدودیت کم (توانایی تغییر پوزیشن مستقل بدن یا اندام‌ها هرچند به میزان کم)', value: 3}, 
                {label: 'بدون محدودیت (توانایی مستقل، کامل و مکرر در تغییر وضعیت و جابجایی بدن و اندام‌ها)', value: 4}
              ]} 
            />
            <AssessmentRow 
              title="۵. وضعیت تغذیه (Nutrition)" 
              description="ارزیابی دریافت مواد غذایی، لوله‌ای یا وریدی متناسب با سن کودک و مقادیر آلبومین"
              currentValue={scores.nutrition} 
              onSelect={(v) => handleSelect('nutrition', v)} 
              options={[
                {label: 'بسیار ضعیف (NPO یا >۵ روز مایعات وریدی؛ آلبومین < ۲.۵؛ عدم اتمام غذا؛ دریافت ناچیز پروتئین)', value: 1}, 
                {label: 'ناکافی (رژیم مایعات/وریدی با کالری نامناسب سن؛ آلبومین < ۳؛ خوردن نیمی از غذا یا ۳ سهم پروتئین)', value: 2}, 
                {label: 'کافی (تغذیه لوله‌ای/وریدی متناسب سن؛ اتمام بالای نصف وعده؛ استفاده از ۴ سهم پروتئین یا مکمل)', value: 3}, 
                {label: 'عالی (رژیم طبیعی؛ اتمام کامل اکثر وعده‌ها؛ استفاده از ۴ سهم یا بیشتر پروتئین و میان‌وعده)', value: 4}
              ]} 
            />
            <AssessmentRow 
              title="۶. نیروهای اصطکاک و سایش (Friction & Shear)" 
              description="سایش پوست با ملافه/سطوح و کشش ناشی از سر خوردن در تخت"
              currentValue={scores.friction} 
              onSelect={(v) => handleSelect('friction', v)} 
              options={[
                {label: 'مشکل عمده (اسپاسم، کنتراکتور، خارش یا بی‌قراری منجر به سایش دائمی پوست با سطوح)', value: 1}, 
                {label: 'مشکل (نیاز به کمک متوسط تا زیاد جهت جابجایی بدون کشیدگی؛ سر خوردن مکرر در تخت/صندلی)', value: 2}, 
                {label: 'مشکل بالقوه (ضعف جزئی/نیاز به کمک کم؛ احتمال کشیدگی پوست؛ حفظ پوزیشن اکثر اوقات)', value: 3}, 
                {label: 'بدون مشکل واضح (جابجایی کاملاً مستقل؛ قدرت عضلانی نرمال؛ حفظ دائمی موقعیت صحیح بدن)', value: 4}
              ]} 
            />
            <AssessmentRow 
              title="۷. خون‌رسانی و اکسیژن‌رسانی بافتی (Tissue Perfusion & Oxygenation)" 
              description="بررسی کفایت همودینامیک، اشباع اکسیژن، هموگلوبین و خون‌رسانی مویرگی"
              currentValue={scores.perfusion} 
              onSelect={(v) => handleSelect('perfusion', v)} 
              options={[
                {label: 'کاملاً مختل شده (MAP کمتر از ۵۰ در کودکان یا کمتر از ۴۰ در نوزادان؛ یا عدم تحمل تغییر وضعیت)', value: 1}, 
                {label: 'مختل شده (فشار خون نرمال اما SpO2 < ۹۵٪، یا هموگلوبین < ۱۰، یا CRT > ۲ ثانیه، یا pH < ۷.۴)', value: 2}, 
                {label: 'کافی (فشار خون نرمال، SpO2 < ۹۵٪ یا هموگلوبین < ۱۰ یا CRT > ۲ ثانیه، اما pH طبیعی است)', value: 3}, 
                {label: 'عالی (فشار خون نرمال، اشباع اکسیژن بالای ۹۵٪، هموگلوبین نرمال و زمان پر شدن مویرگی < ۲ ثانیه)', value: 4}
              ]} 
            />
        </div>
    );
};

const getPushInterpretationAndRecommendations = (score: number, areaScore: number, exudate: number, tissue: number) => {
  let interpretation = "امتیاز پایین‌تر نشان‌دهنده بهبودی زخم است. هدف، کاهش امتیاز در طول زمان است. (۰ = بهبود یافته | ۱۷ = بدترین وضعیت)";
  let woundSeverity = "";
  if (score > 13) woundSeverity = "وضعیت شدید";
  else if (score > 8) woundSeverity = "وضعیت متوسط";
  else if (score > 0) woundSeverity = "وضعیت خفیف";
  else woundSeverity = "زخم بهبود یافته";
  
  interpretation = `(${woundSeverity}) ` + interpretation;

  const recommendations: string[] = [];

  recommendations.push("امتیاز PUSH را به صورت هفتگی ثبت و نمودار آن را رسم کنید تا روند بهبودی به صورت بصری پایش شود.");

  if (tissue === 4) { // Necrotic
    recommendations.push("بافت نکروتیک مانع اصلی بهبودی است. نیاز فوری به دبریدمان (جراحی، آنزیماتیک یا اتولیتیک) با هماهنگی تیم درمان وجود دارد.");
  } else if (tissue === 3) { // Slough
    recommendations.push("بافت اسلاف (زرد) باید با روش‌های مناسب برداشته شود. استفاده از دبریدمان اتولیتیک (مانند هیدروژل) یا دبریدمان آنزیمی با تجویز پزشک توصیه می‌شود.");
  } else if (tissue === 2) { // Granulation
    recommendations.push("بافت گرانولاسیون (قرمز و سالم) نشان‌دهنده روند بهبودی مناسب است. استفاده از پانسمان‌های مرطوب نگه‌دارنده (مانند فوم یا هیدروکلوئید) برای محافظت از بستر زخم توصیه می‌شود.");
  } else if (tissue === 1) { // Epithelial
    recommendations.push("بافت اپیتلیال (پوست جدید) در حال شکل‌گیری است. محافظت دقیق از این بافت حساس و جدید در برابر نیروهای سایشی و فشار مستقیم ضرورت بالایی دارد.");
  } else if (tissue === 0) { // Closed
    recommendations.push("زخم به طور کامل بسته شده است. با این حال، مراقبت‌های پیشگیرانه از جمله مرطوب نگه داشتن پوست اطراف و کاهش فشار ادامه یابد.");
  }

  if (exudate >= 2) {
    recommendations.push("ترشحات زخم متوسط تا زیاد است. استفاده از پانسمان‌های با قدرت جذب بالا (مانند آلژینات‌ها یا فوم‌های فوق جاذب) جهت مدیریت اگزودا و جلوگیری از آسیب به پوست سالم اطراف زخم ضروری است.");
  } else if (exudate === 1) {
    recommendations.push("ترشحات زخم ناچیز و خفیف است. استفاده از پانسمان‌های هیدروکلوئید یا پانسمان فوم نازک برای این سطح ترشحات کافی است.");
  }

  if (areaScore >= 7) {
    recommendations.push("مساحت زخم نسبتاً وسیع است. به منظور تسهیل سلول‌سازی و تسریع روند بهبود، مشاوره تغذیه جهت غنی‌سازی پروتئین، کالری و دریافت ویتامین‌ها مد نظر قرار گیرد.");
  }

  return { interpretation, recommendations };
};

const getNSRASRecommendations = (score: number): string[] => {
  if (score < 10) {
    return [
      "ادامه مراقبت‌های روتین پوستی نوزاد و پایش روزانه نواحی تحت فشار.",
      "تعویض روتین ملحفه و پوشک نوزاد (به طور منظم هر ۲۴ ساعت یا به هنگام نیاز).",
      "ارزیابی مجدد ریسک در صورت تغییر شرایط بالینی یا داروهای آرام‌بخش نوزاد."
    ];
  } else if (score <= 20) {
    return [
      "پروتکل تغییر وضعیت نوزاد حداقل هر ۲ ساعت یکبار به صورت فوق‌العاده ملایم.",
      "استفاده از رینگ‌های ژله‌ای ظریف مخصوص نوزادان زیر سر به ویژه استخوان پس‌سری (Occiput) جهت به حداقل رساندن فشار مستقیم.",
      "محافظت کامل پوست در برابر تجهیزات تهاجمی (مانند لوله‌های تراشه یا پروب‌های مانیتورینگ) با استفاده از پانسمان‌های هیدروکلوئید محافظ زیر چسب.",
      "مدیریت شدید رطوبت؛ پایش مداوم پوشک نوزاد و ملافه و استفاده از لایه‌های جاذب مرطوب به محض ایجاد نم یا ترشح.",
      "استفاده مکرر از پمادها و بریرهای محافظ پوست حاوی زینک اکساید برای پیشگیری از درماتیت ادراری و التهاب موضعی."
    ];
  } else {
    return [
      "قراردادن فوری نوزاد روی تشک‌های پیشرفته مواج نئوناتال یا پدهای ژلی کاهنده فشار قوی در بخش NICU.",
      "تغییر پوزیشن نوزاد هر ۱ تا ۲ ساعت با حداکثر دقت و به آرامی توسط دو پرسنل جهت به صفر رساندن نیروی اصطکاک و کشش پوستی.",
      "پایش مداوم اکسیژن‌رسانی بافتی، زمان پر شدن مجدد مویرگی (CRT) و حفظ فشار خون شریانی متناسب با سن حاملگی نوزاد برای تأمین پرفیوژن محیطی مطلوب.",
      "آزاد نگه داشتن پاشنه و قوزک پاهای نوزاد از تماس مستقیم با سطح تخت با استفاده از رول‌های فوم یا پارچه‌ای نرم و کوچک.",
      "بررسی تغذیه وریدی (TPN) و اسیدهای آمینه دریافتی نوزاد با همکاری پزشک فوق تخصص نوزادان جهت تقویت سد دفاعی پوست نوزادان زودرس."
    ];
  }
};

const NSRASScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
  const [scores, setScores] = useState({
    physical: 1,
    mental: 1,
    mobility: 1,
    activity: 1,
    nutrition: 1,
    moisture: 1
  });

  useEffect(() => {
    const totalScore = scores.physical + scores.mental + scores.mobility + scores.activity + scores.nutrition + scores.moisture;
    let interpretation = "", color = "", icon = "";

    if (totalScore < 10) {
      interpretation = "بدون خطر زخم فشاری (No Risk)";
      color = "bg-emerald-600";
      icon = "✅";
    } else if (totalScore <= 20) {
      interpretation = "خطر بالا زخم فشاری (High Risk)";
      color = "bg-orange-600";
      icon = "🟠";
    } else {
      interpretation = "خطر بسیار بالا زخم فشاری (Very High Risk)";
      color = "bg-rose-700";
      icon = "🚨";
    }

    if (totalScore >= 13) {
      interpretation += " - ⚠️ نوزاد در معرض خطر زخم فشاری (Sore) می‌باشد.";
    }

    const recommendations = getNSRASRecommendations(totalScore);
    onResult({ score: totalScore, interpretation, color, icon, recommendations, toolUsed: "NSRAS" });
  }, [scores]);

  const handleSelect = (category: keyof typeof scores, value: number) => {
    setScores(prev => ({ ...prev, [category]: value }));
  };

  return (
    <div className="grid gap-12 pt-8">
      <div className="bg-indigo-950/40 p-6 rounded-3xl border border-indigo-500/10 text-center">
        <h4 className="text-xl font-black text-white">معیار ارزیابی خطر زخم بستر نوزادان (NSRAS)</h4>
        <p className="text-slate-400 text-sm mt-1">ابزار ارزیابی و غربالگری دقیق خطر ایجاد زخم فشاری در نوزادان بستری در بخش‌های نوزادان و NICU</p>
      </div>

      <AssessmentRow
        title="۱. وضعیت فیزیکی عمومی (سن حاملگی)"
        description="ارزیابی وضعیت فیزیکی نوزاد متناسب با میزان رشد داخل رحمی و سن حاملگی"
        currentValue={scores.physical}
        onSelect={(v) => handleSelect("physical", v)}
        options={[
          { label: "سن حاملگی ۳۸ هفته یا بیشتر (در زمان تولد یا سن کنونی)", value: 1 },
          { label: "سن حاملگی بین ۳۳ تا ۳۸ هفته", value: 2 },
          { label: "سن حاملگی بین ۲۸ تا ۳۳ هفته", value: 3 },
          { label: "سن حاملگی کمتر از ۲۸ هفته", value: 4 }
        ]}
      />

      <AssessmentRow
        title="۲. وضعیت هوشیاری"
        description="واکنش نوزاد به محرک‌های حسی و درجه بیداری"
        currentValue={scores.mental}
        onSelect={(v) => handleSelect("mental", v)}
        options={[
          { label: "کاملاً هوشیار و فعال (حرکات ارادی منظم، گریه قوی و بیداری متناوب)", value: 1 },
          { label: "کمی خواب‌آلود (پاسخ به لمس و صدا، خواب‌آلودگی بیش از حد نرمال)", value: 2 },
          { label: "پاسخ به تحریکات دردناک (واکنش با لرز، ناله، افزایش فشار خون یا افزایش ضربان قلب)", value: 3 },
          { label: "عدم پاسخ به تحریکات دردناک ناشی از کاهش شدید سطح هوشیاری، کما یا تحت تأثیر داروهای آرام‌بخش قوی", value: 4 }
        ]}
      />

      <AssessmentRow
        title="۳. تحرک و تغییر موقعیت بدن"
        description="توانایی نوزاد در تغییر پوزیشن بدن و اندام‌های خود به طور مستقل"
        currentValue={scores.mobility}
        onSelect={(v) => handleSelect("mobility", v)}
        options={[
          { label: "بدون محدودیت (حرکات مکرر، پویا و مستقل کل بدن و تغییر وضعیت آزادانه)", value: 1 },
          { label: "کمی محدود (حرکات مکرر اندام‌ها اما توانایی محدود در جابجایی کل بدن)", value: 2 },
          { label: "حرکت بسیار محدود (به ندرت تغییرات خیلی کوچک در تنه یا اندام‌ها ایجاد می‌کند اما قادر به تغییر وضعیت مکرر یا مستقل نیست)", value: 3 },
          { label: "کاملاً بدون حرکت (عدم وجود هرگونه حرکت ارادی یا غیرارادی در اندام‌ها، شلی کامل عضلات)", value: 4 }
        ]}
      />

      <AssessmentRow
        title="۴. فعالیت فیزیکی"
        description="محدودیت حرکتی نوزاد ناشی از نوع تختخواب یا وسایل نگهدارنده او"
        currentValue={scores.activity}
        onSelect={(v) => handleSelect("activity", v)}
        options={[
          { label: "نامحدود؛ نوزاد راحت داخل کات (Crib/Cot)", value: 1 },
          { label: "کمی محدود؛ نوزاد داخل انکوباتور (Incubator)", value: 2 },
          { label: "تا حدودی محدود به تخت； نوزاد تحت گرم‌کننده تابشی (وارمر) بدون پوشش سلفونی", value: 3 },
          { label: "کاملاً محدود به تخت； نوزاد تحت گرم‌کننده تابشی (وارمر) با پوشش سلفونی محافظ رطوبت", value: 4 }
        ]}
      />

      <AssessmentRow
        title="۵. وضعیت تغذیه"
        description="نوع و کفایت دریافت تغذیه‌ای نوزاد بر اساس تغذیه دهانی، لوله‌ای یا وریدی"
        currentValue={scores.nutrition}
        onSelect={(v) => handleSelect("nutrition", v)}
        options={[
          { label: "عالی (تغذیه دهانی کامل با شیر مادر یا بطری با ولع و مکش قوی)", value: 1 },
          { label: "کافی (تغذیه کامل از طریق لوله بینی-معده NGT/OGT یا تغذیه کمکی موفق)", value: 2 },
          { label: "ناکافی (دریافت جزئی شیر خشک/شیر مادر به همراه مایعات وریدی کمکی)", value: 3 },
          { label: "بسیار ضعیف (کاملاً NPO، دریافت انحصاری مایعات وریدی بدون کالری و پروتئین کافی)", value: 4 }
        ]}
      />

      <AssessmentRow
        title="۶. رطوبت پوست"
        description="میزان قرارگیری پوست در معرض ترشحات، ادرار، مدفوع یا تعریق شدید"
        currentValue={scores.moisture}
        onSelect={(v) => handleSelect("moisture", v)}
        options={[
          { label: "به ندرت مرطوب (پوست معمولاً خشک و تمیز； نیاز به تعویض ملحفه‌ها حداکثر هر ۲۴ ساعت)", value: 1 },
          { label: "گاهی اوقات مرطوب (پوست گهگاه نمناک； نیاز به تعویض ملحفه حداقل یک بار در روز)", value: 2 },
          { label: "مرطوب (پوست اغلب مرطوب است； نیاز به تعویض ملحفه به صورت منظم در هر شیفت کاری)", value: 3 },
          { label: "همیشه پوست مرطوب (رطوبت دائمی شدید； نیاز به تعویض ملحفه‌ها به همراه هر بار جابجایی یا معاینه نوزاد)", value: 4 }
        ]}
      />
    </div>
  );
};

const PUSHScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
  const [area, setArea] = useState(0);
  const [exudate, setExudate] = useState(0);
  const [tissue, setTissue] = useState(0);

  useEffect(() => {
    const total = area + exudate + tissue;
    const { interpretation, recommendations } = getPushInterpretationAndRecommendations(total, area, exudate, tissue);
    
    let color = "bg-emerald-600";
    let icon = "✅";
    if (total > 13) {
      color = "bg-rose-700";
      icon = "🚨";
    } else if (total > 8) {
      color = "bg-orange-600";
      icon = "🟠";
    } else if (total > 0) {
      color = "bg-amber-500";
      icon = "🟡";
    }

    onResult({
      score: total,
      interpretation,
      color,
      icon,
      recommendations,
      toolUsed: "PUSH 3.0"
    });
  }, [area, exudate, tissue]);

  return (
    <div className="grid gap-12 pt-8">
      <div className="bg-indigo-950/40 p-6 rounded-3xl border border-indigo-500/10 text-center">
        <h4 className="text-xl font-black text-white">ابزار پایش بهبود زخم فشاری (PUSH Tool 3.0)</h4>
        <p className="text-slate-400 text-sm mt-1">اندازه‌گیری و ثبت منظم تغییرات زخم فشاری برای ارزیابی میزان اثربخشی درمان</p>
      </div>

      <AssessmentRow
        title="۱. مساحت زخم (طول × عرض)"
        description="بزرگترین طول در بزرگترین عرض زخم را بر حسب سانتی‌متر مربع محاسبه کنید"
        currentValue={area}
        onSelect={setArea}
        options={[
          { label: "۰ (زخم کاملاً بسته و ترمیم شده)", value: 0 },
          { label: "۰.۳ > (کمتر از ۰.۳ سانتی‌متر مربع)", value: 1 },
          { label: "۰.۳ تا ۰.۶ سانتی‌متر مربع", value: 2 },
          { label: "۰.۷ تا ۱.۰ سانتی‌متر مربع", value: 3 },
          { label: "۱.۱ تا ۲.۰ سانتی‌متر مربع", value: 4 },
          { label: "۲.۱ تا ۳.۰ سانتی‌متر مربع", value: 5 },
          { label: "۳.۱ تا ۴.۰ سانتی‌متر مربع", value: 6 },
          { label: "۴.۱ تا ۸.۰ سانتی‌متر مربع", value: 7 },
          { label: "۸.۱ تا ۱۲.۰ سانتی‌متر مربع", value: 8 },
          { label: "۱۲.۱ تا ۲۴.۰ سانتی‌متر مربع", value: 9 },
          { label: "۲۴.۰ < (بیشتر از ۲۴.۰ سانتی‌متر مربع)", value: 10 }
        ]}
      />

      <AssessmentRow
        title="۲. میزان ترشحات زخم (Exudate Amount)"
        description="میزان ترشحات را قبل از قرار دادن پانسمان جدید ارزیابی کنید"
        currentValue={exudate}
        onSelect={setExudate}
        options={[
          { label: "هیچ (خشک یا بدون ترشح واضح)", value: 0 },
          { label: "کم (Light - مقدار کمی ترشح روی پانسمان)", value: 1 },
          { label: "متوسط (Moderate - پانسمان مرطوب است اما اشباع نشده)", value: 2 },
          { label: "زیاد (Heavy - اشباع شدن پانسمان و نشت ترشحات)", value: 3 }
        ]}
      />

      <AssessmentRow
        title="۳. نوع بافت غالب (Tissue Type)"
        description="نوع بافت موجود در بستر زخم را ارزیابی کنید (بافت غالب با بالاترین امتیاز)"
        currentValue={tissue}
        onSelect={setTissue}
        options={[
          { label: "بافت ترمیم شده (بسته شده با پوست جدید)", value: 0 },
          { label: "بافت اپیتلیال (جدید، صورتی یا براق)", value: 1 },
          { label: "بافت گرانولاسیون (قرمز، مرطوب و گوشتی)", value: 2 },
          { label: "اسلاف (بافت مرده زرد یا خاکستری، فیبرینی)", value: 3 },
          { label: "نکروز / اشکار (بافت سیاه یا قهوه‌ای، سخت و چرمی)", value: 4 }
        ]}
      />
    </div>
  );
};

const PressureUlcerAssessment: React.FC<{ onBack: () => void; onHome: () => void; }> = ({ onBack, onHome }) => {
  const [scale, setScale] = useState<"braden" | "bradenq" | "nsras" | "push" | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleBack = () => {
    if (scale) {
      setScale(null);
      setResult(null);
    } else {
      onBack();
    }
  };

  const renderContent = () => {
    if (!scale) {
      return (
        <div className="space-y-12 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <MainCard 
              title="ارزیابی بزرگسالان" 
              subtitle="Braden Scale" 
              icon="🛡️" 
              onClick={() => setScale("braden")} 
              description="ابزار استاندارد بالینی برای پیش‌بینی و ارزیابی خطر ایجاد زخم فشاری در بیماران بزرگسال." 
            />
            <MainCard 
              title="ارزیابی اطفال (Braden Q)" 
              subtitle="Braden Q Scale" 
              icon="👶" 
              onClick={() => setScale("bradenq")} 
              description="نسخه تعدیل‌شده و تخصصی کودکان و نوزادان بر اساس راهنمای جدید بروز زخم فشاری اطفال." 
            />
            <MainCard 
              title="ارزیابی نوزادان (NSRAS)" 
              subtitle="NSRAS Scale" 
              icon="🤱" 
              onClick={() => setScale("nsras")} 
              description="ابزار اختصاصی پایش خطر ابتلا به زخم فشاری در نوزادان بستری در بخش‌های مراقبت ویژه نوزادان (NICU)." 
            />
            <MainCard 
              title="پایش بهبود زخم" 
              subtitle="PUSH Tool 3.0" 
              icon="📈" 
              onClick={() => setScale("push")} 
              description="ابزار استاندارد انجمن زخم ملی جهت پایش، ثبت و ارزیابی روند درمان زخم‌های فشاری موجود." 
            />
          </div>

          <div className="border-t border-white/5 pt-12 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-4xl">💡</span>
              <h4 className="text-2xl font-black text-white">متدها و تکنیک‌های استاندارد پیشگیری از زخم فشاری</h4>
              <p className="text-slate-400 text-sm max-w-2xl mx-auto">دستورالعمل‌های استاندارد بالینی و مراقبتی به منظور کاهش اصطکاک، فشار مستقیم و رطوبت پوست</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
              <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 space-y-4 hover:border-indigo-500/20 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🔄</span>
                  <div>
                    <h5 className="text-lg font-black text-indigo-300">۱. پوزیشن‌دهی و تغییر وضعیت منظم</h5>
                    <span className="text-[10px] text-slate-500 font-mono">Regular Repositioning</span>
                  </div>
                </div>
                <ul className="list-disc list-inside text-slate-300 text-sm space-y-2.5 leading-relaxed pr-2">
                  <li>تغییر موقعیت و پوزیشن بیمار در تخت حداقل هر ۲ ساعت و در ویلچر/صندلی هر ۱۵ دقیقه.</li>
                  <li><strong>تکنیک زاویه ۳۰ درجه:</strong> شیب‌دهی به بیمار به صورت پهلوی ۳۰ درجه (پرهیز از زاویه ۹۰ درجه مستقیم جهت کاهش حداکثری بار بر روی استخوان خاجی (ساکروم) و ران).</li>
                  <li>استفاده از ملافه‌های روان یا تجهیزات بالابرنده در زمان جابجایی به منظور جلوگیری از بروز نیروهای کششی و اصطکاکی بر روی پوست.</li>
                </ul>
              </div>

              <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 space-y-4 hover:border-indigo-500/20 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🛡️</span>
                  <div>
                    <h5 className="text-lg font-black text-indigo-300">۲. کاهش موضعی فشار با ابزار محافظ</h5>
                    <span className="text-[10px] text-slate-500 font-mono">Pressure-Relieving Surfaces</span>
                  </div>
                </div>
                <ul className="list-disc list-inside text-slate-300 text-sm space-y-2.5 leading-relaxed pr-2">
                  <li>استفاده مقتضی از تشک‌های مواج سلولی استاندارد برای بیماران بستری طولانی‌مدت.</li>
                  <li>بکارگیری رینگ‌های ژله‌ای، فوم یا پانسمان‌های فوم چند لایه سیلیکونی در نواحی مستعد (همچون پشت سر، پاشنه پا و ساکروم).</li>
                  <li>شناور یا آزاد نگه داشتن مچ و پاشنه پا نسبت به سطح تخت با قرار دادن بالش ملایم زیر ساق پا.</li>
                </ul>
              </div>

              <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 space-y-4 hover:border-indigo-500/20 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🧴</span>
                  <div>
                    <h5 className="text-lg font-black text-indigo-300">۳. پایش و مراقبت پوستی روزانه</h5>
                    <span className="text-[10px] text-slate-500 font-mono">Daily Skin Care & Moisture Management</span>
                  </div>
                </div>
                <ul className="list-disc list-inside text-slate-300 text-sm space-y-2.5 leading-relaxed pr-2">
                  <li>بررسی کامل پوست حداقل یک بار در روز با تمرکز دقیق بر روی تمام برجستگی‌های استخوانی مستعد زخم.</li>
                  <li>تمیز نگه‌داشتن فوری پوست پس از بی‌اختیاری ادرار یا مدفوع با پاک‌کننده‌های ملایم و استفاده از کرم‌های سدکننده (بریر مانند اکسید روی).</li>
                  <li><strong>هشدار بالینی:</strong> از ماساژ دادن برجستگی‌های استخوانی قرمز شده یا بافت‌های ملتهب به شدت پرهیز کنید زیرا ریسک تخریب بافت زیرپوستی را به شدت بالا می‌برد.</li>
                </ul>
              </div>

              <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 space-y-4 hover:border-indigo-500/20 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🍎</span>
                  <div>
                    <h5 className="text-lg font-black text-indigo-300">۴. تغذیه تکمیلی و هیدراتاسیون</h5>
                    <span className="text-[10px] text-slate-500 font-mono">Nutrition & Hydration Support</span>
                  </div>
                </div>
                <ul className="list-disc list-inside text-slate-300 text-sm space-y-2.5 leading-relaxed pr-2">
                  <li>ارائه رژیم غذایی پرکالری، سرشار از پروتئین مرغوب، ویتامین‌های گروه C و روی (Zinc) جهت استحکام بافت پوست.</li>
                  <li>تأمین هیدراتاسیون کافی روزانه (به جز موارد منع مصرف بالینی) جهت جلوگیری از خشکی شدید و شکنندگی پوست.</li>
                  <li>پایش فعال سطح شاخص‌های بیوشیمیایی تغذیه از جمله سطح آلبومین تام سرم و الکترولیت‌ها.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (scale === "braden") return <BradenScale onResult={setResult} />;
    if (scale === "bradenq") return <BradenQScale onResult={setResult} />;
    if (scale === "nsras") return <NSRASScale onResult={setResult} />;
    if (scale === "push") return <PUSHScale onResult={setResult} />;
  };

  return (
    <div className="space-y-8">
      <ModuleHeader onBack={handleBack} onHome={onHome} />
      <div className="premium-card p-10 space-y-8 border-indigo-500/20">
        <div className="pb-8 border-b border-white/5 text-center">
          <h3 className="text-3xl font-black text-white">ارزیابی زخم فشاری</h3>
          <p className="text-indigo-400 text-base font-bold mt-2">انتخاب ابزار بر اساس هدف ارزیابی (ریسک یا پایش)</p>
        </div>
        {renderContent()}
      </div>
      {result && <AssessmentResultDisplay title={`نتیجه ارزیابی ${result.toolUsed}`} toolUsed={result.toolUsed} score={result.score} interpretation={result.interpretation} color={result.color} icon={result.icon} recommendations={result.recommendations} />}
    </div>
  );
};

const MainCard = ({ title, subtitle, icon, onClick, description }: any) => (
  <button onClick={onClick} className="group premium-card p-10 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center border-white/5 hover:border-indigo-500/50">
    <div className="w-24 h-24 bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 text-6xl">{icon}</div>
    <h3 className="text-3xl font-black text-white mb-2">{title}</h3>
    <p className="text-indigo-400 text-sm font-bold mb-4">{subtitle}</p>
    <p className="text-slate-400 text-xs leading-relaxed">{description}</p>
  </button>
);

export default PressureUlcerAssessment;

import React from 'react';
import { MapPin } from 'lucide-react';

const Location = () => {
    return (
        <section id="location" className="py-24 bg-slate-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 rounded-2xl overflow-hidden shadow-xl bg-white">
                    {/* Info */}
                    <div className="p-10 lg:p-14 flex flex-col justify-center">
                        <span className="text-secondary font-bold tracking-widest text-sm uppercase mb-3 block">Location</span>
                        <h2 className="text-3xl font-bold text-primary mb-6">오시는 길</h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-full text-primary shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Church Address</h4>
                                    <p className="text-gray-600">
                                        9025 Glover Road<br />
                                        Fort Langley, BC V1M 2R9<br />
                                        Canada
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed mt-4 bg-gray-50 p-4 rounded-lg">
                                * 포트 랭리(Fort Langley) 중심부에 위치하고 있습니다.<br />
                                * 주차는 교회 뒷편 주차장을 이용해 주세요.
                            </p>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="h-[400px] lg:h-auto bg-gray-300 relative">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2610.743126343586!2d-122.58356942323891!3d49.16912387137573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5485d51d4576395b%3A0x6283733022130e5c!2s9025%20Glover%20Rd%2C%20Langley%20Twp%2C%20BC%20V1M%202R9!5e0!3m2!1sen!2sca!4v1706604123456!5m2!1sen!2sca"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Church Location"
                            className="absolute inset-0"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Location;
